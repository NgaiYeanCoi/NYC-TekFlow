package xyz.nyc.tekflow.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.nyc.tekflow.aspect.AuditAction;
import xyz.nyc.tekflow.aspect.PerfMonitor;
import xyz.nyc.tekflow.common.BusinessException;
import xyz.nyc.tekflow.common.PageResponse;
import xyz.nyc.tekflow.dto.PostDtos.PostRequest;
import xyz.nyc.tekflow.dto.PostDtos.PostResponse;
import xyz.nyc.tekflow.dto.PostDtos.PostSummaryResponse;
import xyz.nyc.tekflow.entity.Attachment;
import xyz.nyc.tekflow.entity.Category;
import xyz.nyc.tekflow.entity.Post;
import xyz.nyc.tekflow.entity.Project;
import xyz.nyc.tekflow.entity.Tag;
import xyz.nyc.tekflow.mapper.AttachmentMapper;
import xyz.nyc.tekflow.mapper.CategoryMapper;
import xyz.nyc.tekflow.mapper.PostMapper;
import xyz.nyc.tekflow.mapper.PostTagMapper;
import xyz.nyc.tekflow.mapper.ProjectMapper;
import xyz.nyc.tekflow.mapper.TagMapper;

@Service
public class PostService {
    private final PostMapper postMapper;
    private final PostTagMapper postTagMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final ProjectMapper projectMapper;
    private final AttachmentMapper attachmentMapper;
    private final SlugService slugService;
    private final ResponseMapper responseMapper;

    public PostService(PostMapper postMapper, PostTagMapper postTagMapper, CategoryMapper categoryMapper,
                       TagMapper tagMapper, ProjectMapper projectMapper, AttachmentMapper attachmentMapper,
                       SlugService slugService, ResponseMapper responseMapper) {
        this.postMapper = postMapper;
        this.postTagMapper = postTagMapper;
        this.categoryMapper = categoryMapper;
        this.tagMapper = tagMapper;
        this.projectMapper = projectMapper;
        this.attachmentMapper = attachmentMapper;
        this.slugService = slugService;
        this.responseMapper = responseMapper;
    }

    @PerfMonitor
    public PageResponse<PostResponse> adminPosts(String keyword, String type, String visibility, String status,
                                                 Long categoryId, Long projectId, Long tagId, int page, int pageSize) {
        int safePage = safePage(page);
        int safePageSize = safePageSize(pageSize);
        int offset = (safePage - 1) * safePageSize;
        List<Post> posts = postMapper.selectAdminPosts(keyword, type, visibility, status, categoryId, projectId, tagId, safePageSize, offset);
        long total = postMapper.countAdminPosts(keyword, type, visibility, status, categoryId, projectId, tagId);
        return new PageResponse<>(posts.stream().map(this::toResponse).toList(), total, safePage, safePageSize);
    }

    public PostResponse adminPost(Long id) {
        return toResponse(requirePost(id));
    }

    public PostSummaryResponse adminSummary() {
        return new PostSummaryResponse(
                postMapper.countActive(),
                postMapper.countByStatus("published"),
                postMapper.countByStatus("draft"),
                postMapper.countByStatus("archived"),
                postMapper.countByVisibility("private"),
                postMapper.countByVisibility("public"),
                postMapper.countByVisibility("school"),
                postMapper.countByVisibility("unlisted"),
                postMapper.countByType("school_notice"),
                attachmentMapper.countActive(),
                categoryMapper.countActive(),
                tagMapper.countActive(),
                projectMapper.countActive()
        );
    }

    @Transactional
    @AuditAction("post.create")
    public PostResponse create(PostRequest request) {
        Post post = new Post();
        applyRequest(post, request, null);
        ensureSlugUnique(post.getSlug(), null);
        PostRules.validate(post);
        postMapper.insertPost(post);
        replaceTags(post.getId(), request.tagIds());
        return toResponse(requirePost(post.getId()));
    }

    @Transactional
    @AuditAction("post.update")
    public PostResponse update(Long id, PostRequest request) {
        Post post = requirePost(id);
        applyRequest(post, request, post.getPublishedAt());
        ensureSlugUnique(post.getSlug(), id);
        PostRules.validate(post);
        postMapper.updatePost(post);
        replaceTags(post.getId(), request.tagIds());
        return toResponse(requirePost(id));
    }

    @AuditAction("post.delete")
    public void delete(Long id) {
        requirePost(id);
        postMapper.softDelete(id);
    }

    @PerfMonitor
    public PageResponse<PostResponse> wikiPosts(String keyword, Long categoryId, Long projectId, Long tagId, int page, int pageSize) {
        int safePage = safePage(page);
        int safePageSize = safePageSize(pageSize);
        int offset = (safePage - 1) * safePageSize;
        List<Post> posts = postMapper.selectPublicPosts(keyword, categoryId, projectId, tagId, safePageSize, offset);
        long total = postMapper.countPublicPosts(keyword, categoryId, projectId, tagId);
        return new PageResponse<>(posts.stream().map(this::toResponse).toList(), total, safePage, safePageSize);
    }

    public PostResponse wikiPost(String slug) {
        Post post = postMapper.findPublicBySlug(slug);
        if (post == null) {
            throw notFound();
        }
        return toResponse(post);
    }

    public PostResponse sharePost(String slug) {
        Post post = postMapper.findShareBySlug(slug);
        if (post == null) {
            throw notFound();
        }
        return toResponse(post);
    }

    @PerfMonitor
    public PageResponse<PostResponse> schoolNotices(String courseName, String noticeStatus, String noticePriority,
                                                    LocalDate fromDate, LocalDate toDate, int page, int pageSize) {
        int safePage = safePage(page);
        int safePageSize = safePageSize(pageSize);
        int offset = (safePage - 1) * safePageSize;
        List<Post> posts = postMapper.selectSchoolNotices(courseName, noticeStatus, noticePriority, fromDate, toDate, safePageSize, offset);
        long total = postMapper.countSchoolNotices(courseName, noticeStatus, noticePriority, fromDate, toDate);
        return new PageResponse<>(posts.stream().map(this::toResponse).toList(), total, safePage, safePageSize);
    }

    public PostResponse schoolNotice(String slug) {
        Post post = postMapper.findSchoolBySlug(slug);
        if (post == null) {
            throw notFound();
        }
        return toResponse(post);
    }

    public Post requirePost(Long id) {
        Post post = postMapper.findActiveById(id);
        if (post == null) {
            throw notFound();
        }
        return post;
    }

    public Post findActivePost(Long id) {
        return postMapper.findActiveById(id);
    }

    private void applyRequest(Post post, PostRequest request, LocalDateTime existingPublishedAt) {
        post.setTitle(request.title());
        post.setSlug(slugService.normalize(request.slug() == null || request.slug().isBlank() ? request.title() : request.slug()));
        post.setSummary(request.summary());
        post.setContent(request.content());
        post.setType(request.type());
        post.setVisibility(request.visibility());
        post.setStatus(request.status());
        post.setCategoryId(request.categoryId());
        post.setProjectId(request.projectId());
        post.setEventDate(request.eventDate());
        post.setStartTime(request.startTime());
        post.setEndTime(request.endTime());
        post.setDeadlineAt(request.deadlineAt());
        post.setLocation(request.location());
        post.setCourseName(request.courseName());
        post.setTeacherName(request.teacherName());
        post.setNoticePriority(request.noticePriority());
        post.setIsNoticeDone(Boolean.TRUE.equals(request.isNoticeDone()));
        if (!"school_notice".equals(request.type())) {
            clearSchoolFields(post);
        }
        if ("school_notice".equals(post.getType())) {
            post.setNoticeStatus(PostRules.calculateNoticeStatus(post));
        }
        post.setPublishedAt("published".equals(post.getStatus())
                ? (existingPublishedAt == null ? LocalDateTime.now() : existingPublishedAt)
                : null);
    }

    private void clearSchoolFields(Post post) {
        post.setEventDate(null);
        post.setStartTime(null);
        post.setEndTime(null);
        post.setDeadlineAt(null);
        post.setLocation(null);
        post.setCourseName(null);
        post.setTeacherName(null);
        post.setNoticePriority(null);
        post.setNoticeStatus(null);
        post.setIsNoticeDone(false);
    }

    private void replaceTags(Long postId, List<Long> tagIds) {
        postTagMapper.deleteByPostId(postId);
        if (tagIds == null) {
            return;
        }
        tagIds.stream().distinct().forEach(tagId -> {
            if (tagMapper.findActiveById(tagId) != null) {
                postTagMapper.insert(postId, tagId);
            }
        });
    }

    private void ensureSlugUnique(String slug, Long excludeId) {
        if (postMapper.countBySlug(slug, excludeId) > 0) {
            throw new BusinessException(HttpStatus.CONFLICT, 409, "slug 已存在");
        }
    }

    private PostResponse toResponse(Post post) {
        if ("school_notice".equals(post.getType())) {
            post.setNoticeStatus(PostRules.calculateNoticeStatus(post));
        }
        Category category = post.getCategoryId() == null ? null : categoryMapper.findActiveById(post.getCategoryId());
        Project project = post.getProjectId() == null ? null : projectMapper.findActiveById(post.getProjectId());
        List<Tag> tags = tagMapper.findByPostId(post.getId());
        List<Attachment> attachments = attachmentMapper.findByPostId(post.getId());
        return responseMapper.post(post, category, project, tags, attachments);
    }

    private int safePage(int page) {
        return Math.max(page, 1);
    }

    private int safePageSize(int pageSize) {
        if (pageSize <= 0) {
            return 10;
        }
        return Math.min(pageSize, 100);
    }

    private BusinessException notFound() {
        return new BusinessException(HttpStatus.NOT_FOUND, 404, "资源不存在");
    }
}
