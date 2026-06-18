package xyz.nyc.tekflow.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import xyz.nyc.tekflow.aspect.AuditAction;
import xyz.nyc.tekflow.aspect.PerfMonitor;
import xyz.nyc.tekflow.common.BusinessException;
import xyz.nyc.tekflow.config.TekflowProperties;
import xyz.nyc.tekflow.dto.AttachmentDtos.AttachmentResponse;
import xyz.nyc.tekflow.entity.Attachment;
import xyz.nyc.tekflow.entity.Post;
import xyz.nyc.tekflow.mapper.AttachmentMapper;
import xyz.nyc.tekflow.security.UserPrincipal;

@Service
public class AttachmentService {
    private static final long MAX_SIZE = 20L * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "webp", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "md", "txt", "zip"
    );

    private final AttachmentMapper attachmentMapper;
    private final PostService postService;
    private final TekflowProperties properties;
    private final ResponseMapper responseMapper;

    public AttachmentService(AttachmentMapper attachmentMapper, PostService postService,
                             TekflowProperties properties, ResponseMapper responseMapper) {
        this.attachmentMapper = attachmentMapper;
        this.postService = postService;
        this.properties = properties;
        this.responseMapper = responseMapper;
    }

    public List<AttachmentResponse> list() {
        return attachmentMapper.findAllActive().stream().map(responseMapper::attachment).toList();
    }

    @AuditAction("attachment.upload")
    public AttachmentResponse upload(Long postId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, 400, "文件不能为空");
        }
        if (file.getSize() <= 0 || file.getSize() > MAX_SIZE) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, 400, "文件大小超过限制");
        }
        Post post = postService.requirePost(postId);
        String originalName = file.getOriginalFilename() == null ? "attachment" : file.getOriginalFilename();
        String extension = extension(originalName);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, 400, "文件类型不允许");
        }
        try {
            Files.createDirectories(properties.uploadDir());
            String filename = UUID.randomUUID() + "." + extension;
            Path target = properties.uploadDir().resolve(filename).normalize();
            file.transferTo(target);
            Attachment attachment = new Attachment();
            attachment.setPostId(post.getId());
            attachment.setFilename(filename);
            attachment.setOriginalName(originalName);
            attachment.setMimeType(file.getContentType() == null ? "application/octet-stream" : file.getContentType());
            attachment.setSize(file.getSize());
            attachment.setPath(target.toString());
            attachmentMapper.insertAttachment(attachment);
            return responseMapper.attachment(attachment);
        } catch (IOException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, 500, "文件保存失败");
        }
    }

    @PerfMonitor
    @AuditAction("attachment.download")
    public ResponseEntity<Resource> download(Long id) {
        Attachment attachment = attachmentMapper.findActiveById(id);
        if (attachment == null) {
            throw notFound();
        }
        Post post = postService.findActivePost(attachment.getPostId());
        if (!canAccess(post)) {
            throw notFound();
        }
        try {
            Path path = Path.of(attachment.getPath()).normalize();
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists()) {
                throw notFound();
            }
            String encodedName = URLEncoder.encode(attachment.getOriginalName(), StandardCharsets.UTF_8);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(attachment.getMimeType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedName)
                    .body(resource);
        } catch (IOException ex) {
            throw notFound();
        }
    }

    @AuditAction("attachment.delete")
    public void delete(Long id) {
        attachmentMapper.softDelete(id);
    }

    private boolean canAccess(Post post) {
        if (post == null) {
            return false;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return true;
        }
        return PostRules.isVisitorVisible(post);
    }

    private String extension(String filename) {
        int idx = filename.lastIndexOf('.');
        if (idx < 0 || idx == filename.length() - 1) {
            return "";
        }
        return filename.substring(idx + 1).toLowerCase(Locale.ROOT);
    }

    private BusinessException notFound() {
        return new BusinessException(HttpStatus.NOT_FOUND, 404, "资源不存在");
    }
}

