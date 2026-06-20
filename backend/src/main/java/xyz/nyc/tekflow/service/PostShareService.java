package xyz.nyc.tekflow.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.nyc.tekflow.aspect.AuditAction;
import xyz.nyc.tekflow.common.BusinessException;
import xyz.nyc.tekflow.dto.PostDtos.PostResponse;
import xyz.nyc.tekflow.dto.PostShareDtos.PostShareRequest;
import xyz.nyc.tekflow.dto.PostShareDtos.PostShareResponse;
import xyz.nyc.tekflow.dto.PostShareDtos.ShareMetaResponse;
import xyz.nyc.tekflow.dto.PostShareDtos.ShareOpenRequest;
import xyz.nyc.tekflow.entity.Attachment;
import xyz.nyc.tekflow.entity.Post;
import xyz.nyc.tekflow.entity.PostShare;
import xyz.nyc.tekflow.mapper.PostShareMapper;

@Service
public class PostShareService {
    private static final String STATUS_ACTIVE = "active";
    private static final String STATUS_REVOKED = "revoked";
    private static final int DEFAULT_EXPIRY_DAYS = 7;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final PostShareMapper postShareMapper;
    private final PostService postService;
    private final PasswordEncoder passwordEncoder;

    public PostShareService(PostShareMapper postShareMapper, PostService postService, PasswordEncoder passwordEncoder) {
        this.postShareMapper = postShareMapper;
        this.postService = postService;
        this.passwordEncoder = passwordEncoder;
    }

    public PostShareResponse adminShare(Long postId) {
        postService.requirePost(postId);
        PostShare share = postShareMapper.findLatestByPostId(postId);
        return toAdminResponse(postId, share);
    }

    @Transactional
    @AuditAction("share.enable")
    public PostShareResponse enableOrUpdate(Long postId, PostShareRequest request) {
        Post post = requireShareablePost(postId);
        PostShare existing = postShareMapper.findLatestByPostId(post.getId());
        PostShare share = existing == null ? new PostShare() : existing;
        boolean needsNewToken = existing == null || STATUS_REVOKED.equals(existing.getStatus()) || share.getToken() == null;

        share.setPostId(post.getId());
        share.setToken(needsNewToken ? uniqueToken() : share.getToken());
        share.setStatus(STATUS_ACTIVE);
        share.setRevokedAt(null);
        share.setExpiresAt(resolveExpiresAt(request, existing));
        share.setAccessCodeHash(resolveAccessCodeHash(request, existing));
        if (share.getAccessCount() == null) {
            share.setAccessCount(0L);
        }
        if (share.getAttachmentDownloadCount() == null) {
            share.setAttachmentDownloadCount(0L);
        }

        if (existing == null) {
            postShareMapper.insertShare(share);
        } else {
            postShareMapper.updateShare(share);
        }
        return toAdminResponse(post.getId(), postShareMapper.findLatestByPostId(post.getId()));
    }

    @Transactional
    @AuditAction("share.revoke")
    public PostShareResponse revoke(Long postId) {
        postService.requirePost(postId);
        PostShare share = postShareMapper.findLatestByPostId(postId);
        if (share != null && STATUS_ACTIVE.equals(share.getStatus())) {
            postShareMapper.revoke(share.getId());
        }
        return toAdminResponse(postId, postShareMapper.findLatestByPostId(postId));
    }

    @Transactional
    @AuditAction("share.rotate")
    public PostShareResponse rotate(Long postId) {
        Post post = requireShareablePost(postId);
        PostShare share = postShareMapper.findLatestByPostId(post.getId());
        if (share == null) {
            return enableOrUpdate(postId, new PostShareRequest(null, false, null, false));
        }
        share.setToken(uniqueToken());
        share.setStatus(STATUS_ACTIVE);
        share.setRevokedAt(null);
        if (share.getExpiresAt() != null && share.getExpiresAt().isBefore(LocalDateTime.now())) {
            share.setExpiresAt(LocalDateTime.now().plusDays(DEFAULT_EXPIRY_DAYS));
        }
        postShareMapper.updateShare(share);
        return toAdminResponse(post.getId(), postShareMapper.findLatestByPostId(post.getId()));
    }

    public ShareMetaResponse meta(String token) {
        PostShare share = requireShare(token);
        Post post = postService.findActivePost(share.getPostId());
        if (post == null || !"unlisted".equals(post.getVisibility()) || !"published".equals(post.getStatus())) {
            throw notFound();
        }
        boolean revoked = STATUS_REVOKED.equals(share.getStatus());
        boolean expired = isExpired(share);
        String status = revoked ? STATUS_REVOKED : expired ? "expired" : STATUS_ACTIVE;
        return new ShareMetaResponse(status, hasAccessCode(share), share.getExpiresAt(), expired, revoked, post.getTitle());
    }

    @Transactional
    public PostResponse open(String token, ShareOpenRequest request) {
        PostShare share = requireOpenableShare(token, request == null ? null : request.accessCode());
        postShareMapper.incrementAccess(share.getId());
        Post post = postService.findActivePost(share.getPostId());
        return postService.toResponse(post);
    }

    public Long verifyAttachmentAccess(String token, Attachment attachment, String accessCode) {
        if (attachment == null) {
            throw notFound();
        }
        PostShare share = requireOpenableShare(token, accessCode);
        if (!attachment.getPostId().equals(share.getPostId())) {
            throw notFound();
        }
        return share.getId();
    }

    @Transactional
    public void recordAttachmentDownload(Long shareId) {
        postShareMapper.incrementAttachmentDownload(shareId);
    }

    private Post requireShareablePost(Long postId) {
        Post post = postService.requirePost(postId);
        if (!"unlisted".equals(post.getVisibility()) || !"published".equals(post.getStatus())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, 400, "只有已发布的持链接访问内容可以开启分享");
        }
        return post;
    }

    private PostShare requireOpenableShare(String token, String accessCode) {
        PostShare share = requireShare(token);
        Post post = postService.findActivePost(share.getPostId());
        if (post == null || !"unlisted".equals(post.getVisibility()) || !"published".equals(post.getStatus())) {
            throw notFound();
        }
        if (!STATUS_ACTIVE.equals(share.getStatus()) || isExpired(share)) {
            throw notFound();
        }
        if (hasAccessCode(share) && (accessCode == null || accessCode.isBlank() || !passwordEncoder.matches(accessCode, share.getAccessCodeHash()))) {
            throw new BusinessException(HttpStatus.FORBIDDEN, 403, "访问码错误");
        }
        return share;
    }

    private PostShare requireShare(String token) {
        if (token == null || token.isBlank()) {
            throw notFound();
        }
        PostShare share = postShareMapper.findByToken(token);
        if (share == null) {
            throw notFound();
        }
        return share;
    }

    private LocalDateTime resolveExpiresAt(PostShareRequest request, PostShare existing) {
        if (request != null && Boolean.TRUE.equals(request.neverExpires())) {
            return null;
        }
        if (request != null && request.expiresAt() != null) {
            return request.expiresAt();
        }
        if (existing != null && STATUS_ACTIVE.equals(existing.getStatus())) {
            return existing.getExpiresAt();
        }
        return LocalDateTime.now().plusDays(DEFAULT_EXPIRY_DAYS);
    }

    private String resolveAccessCodeHash(PostShareRequest request, PostShare existing) {
        if (request != null && Boolean.TRUE.equals(request.clearAccessCode())) {
            return null;
        }
        if (request != null && request.accessCode() != null && !request.accessCode().isBlank()) {
            return passwordEncoder.encode(request.accessCode());
        }
        return existing == null ? null : existing.getAccessCodeHash();
    }

    private PostShareResponse toAdminResponse(Long postId, PostShare share) {
        if (share == null) {
            return new PostShareResponse(postId, null, "none", false, false, null, false, 0, 0, null, null, null, null);
        }
        boolean expired = isExpired(share);
        boolean active = STATUS_ACTIVE.equals(share.getStatus()) && !expired;
        return new PostShareResponse(
                postId,
                share.getToken(),
                share.getStatus(),
                active,
                hasAccessCode(share),
                share.getExpiresAt(),
                expired,
                nullToZero(share.getAccessCount()),
                nullToZero(share.getAttachmentDownloadCount()),
                share.getLastAccessedAt(),
                share.getRevokedAt(),
                share.getCreatedAt(),
                share.getUpdatedAt()
        );
    }

    private boolean hasAccessCode(PostShare share) {
        return share.getAccessCodeHash() != null && !share.getAccessCodeHash().isBlank();
    }

    private boolean isExpired(PostShare share) {
        return share.getExpiresAt() != null && !share.getExpiresAt().isAfter(LocalDateTime.now());
    }

    private long nullToZero(Long value) {
        return value == null ? 0L : value;
    }

    private String uniqueToken() {
        String token;
        do {
            byte[] bytes = new byte[32];
            SECURE_RANDOM.nextBytes(bytes);
            token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        } while (postShareMapper.countByToken(token) > 0);
        return token;
    }

    private BusinessException notFound() {
        return new BusinessException(HttpStatus.NOT_FOUND, 404, "分享链接不可用");
    }
}
