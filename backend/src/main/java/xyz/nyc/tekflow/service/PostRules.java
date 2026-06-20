package xyz.nyc.tekflow.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import xyz.nyc.tekflow.common.BusinessException;
import xyz.nyc.tekflow.entity.Post;

public final class PostRules {
    private PostRules() {
    }

    public static void validate(Post post) {
        if ("school_notice".equals(post.getType()) != "school".equals(post.getVisibility())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, 400, "school_notice 必须绑定 school 可见性");
        }
        if ("published".equals(post.getStatus())) {
            validatePublish(post);
        }
    }

    public static void validatePublish(Post post) {
        if (("public".equals(post.getVisibility()) || "unlisted".equals(post.getVisibility()))
                && (post.getContent() == null || post.getContent().isBlank())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, 400, "发布公开或链接访问内容时正文不能为空");
        }
        if ("school".equals(post.getVisibility())) {
            if (!"school_notice".equals(post.getType())) {
                throw new BusinessException(HttpStatus.BAD_REQUEST, 400, "school 内容类型必须为 school_notice");
            }
            if (post.getEventDate() == null && post.getDeadlineAt() == null) {
                throw new BusinessException(HttpStatus.BAD_REQUEST, 400, "发布 school notice 时 event_date 或 deadline_at 至少一个存在");
            }
            if (post.getNoticePriority() == null || post.getNoticePriority().isBlank()) {
                throw new BusinessException(HttpStatus.BAD_REQUEST, 400, "发布 school notice 时 notice_priority 必填");
            }
        }
    }

    public static String calculateNoticeStatus(Post post) {
        if (Boolean.TRUE.equals(post.getIsNoticeDone())) {
            return "done";
        }
        LocalDateTime now = LocalDateTime.now();
        if (post.getDeadlineAt() != null && post.getDeadlineAt().isBefore(now)) {
            return "expired";
        }
        LocalDate today = LocalDate.now();
        if (post.getEventDate() != null && post.getEventDate().isEqual(today)) {
            return "ongoing";
        }
        return "upcoming";
    }

    public static boolean isVisitorVisible(Post post) {
        return post != null
                && post.getDeletedAt() == null
                && "published".equals(post.getStatus())
                && ("public".equals(post.getVisibility())
                || "school".equals(post.getVisibility()));
    }
}
