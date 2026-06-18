package xyz.nyc.tekflow.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public final class PostDtos {
    private PostDtos() {
    }

    public record PostRequest(
            @NotBlank String title,
            String slug,
            String summary,
            String content,
            @NotBlank String type,
            @NotBlank String visibility,
            @NotBlank String status,
            Long categoryId,
            Long projectId,
            List<Long> tagIds,
            LocalDate eventDate,
            LocalTime startTime,
            LocalTime endTime,
            LocalDateTime deadlineAt,
            String location,
            String courseName,
            String teacherName,
            String noticePriority,
            Boolean isNoticeDone
    ) {
    }

    public record PostResponse(
            Long id,
            String title,
            String slug,
            String summary,
            String content,
            String type,
            String visibility,
            String status,
            TaxonomyDtos.TaxonomyResponse category,
            TaxonomyDtos.TaxonomyResponse project,
            List<TaxonomyDtos.TaxonomyResponse> tags,
            List<AttachmentDtos.AttachmentResponse> attachments,
            LocalDate eventDate,
            LocalTime startTime,
            LocalTime endTime,
            LocalDateTime deadlineAt,
            String location,
            String courseName,
            String teacherName,
            String noticePriority,
            String noticeStatus,
            Boolean isNoticeDone,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            LocalDateTime publishedAt
    ) {
    }
}

