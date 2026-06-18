package xyz.nyc.tekflow.service;

import java.util.List;
import org.springframework.stereotype.Component;
import xyz.nyc.tekflow.dto.AttachmentDtos.AttachmentResponse;
import xyz.nyc.tekflow.dto.AuthDtos.UserSummary;
import xyz.nyc.tekflow.dto.PostDtos.PostResponse;
import xyz.nyc.tekflow.dto.TaxonomyDtos.TaxonomyResponse;
import xyz.nyc.tekflow.entity.Attachment;
import xyz.nyc.tekflow.entity.Category;
import xyz.nyc.tekflow.entity.Post;
import xyz.nyc.tekflow.entity.Project;
import xyz.nyc.tekflow.entity.Tag;
import xyz.nyc.tekflow.entity.User;

@Component
public class ResponseMapper {
    public UserSummary user(User user) {
        return new UserSummary(user.getId(), user.getUsername(), user.getName(), user.getEmail(), user.getRole());
    }

    public TaxonomyResponse category(Category category) {
        if (category == null) {
            return null;
        }
        return new TaxonomyResponse(category.getId(), category.getName(), category.getSlug(), category.getDescription());
    }

    public TaxonomyResponse tag(Tag tag) {
        if (tag == null) {
            return null;
        }
        return new TaxonomyResponse(tag.getId(), tag.getName(), tag.getSlug(), null);
    }

    public TaxonomyResponse project(Project project) {
        if (project == null) {
            return null;
        }
        return new TaxonomyResponse(project.getId(), project.getName(), project.getSlug(), project.getDescription());
    }

    public AttachmentResponse attachment(Attachment attachment) {
        return new AttachmentResponse(
                attachment.getId(),
                attachment.getPostId(),
                attachment.getFilename(),
                attachment.getOriginalName(),
                attachment.getMimeType(),
                attachment.getSize(),
                attachment.getCreatedAt()
        );
    }

    public PostResponse post(Post post, Category category, Project project, List<Tag> tags, List<Attachment> attachments) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getSlug(),
                post.getSummary(),
                post.getContent(),
                post.getType(),
                post.getVisibility(),
                post.getStatus(),
                category(category),
                project(project),
                tags.stream().map(this::tag).toList(),
                attachments.stream().map(this::attachment).toList(),
                post.getEventDate(),
                post.getStartTime(),
                post.getEndTime(),
                post.getDeadlineAt(),
                post.getLocation(),
                post.getCourseName(),
                post.getTeacherName(),
                post.getNoticePriority(),
                post.getNoticeStatus(),
                post.getIsNoticeDone(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getPublishedAt()
        );
    }
}

