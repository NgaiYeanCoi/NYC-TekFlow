package xyz.nyc.tekflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public final class PostDtos {
    private PostDtos() {
    }

    @Schema(description = "内容创建或更新请求。普通 Post 与 School Notice 共用该结构。")
    public record PostRequest(
            @Schema(description = "标题", example = "TekFlow 部署记录")
            @NotBlank String title,
            @Schema(description = "Slug。留空时后端可根据标题生成", example = "tekflow-deploy-note")
            String slug,
            @Schema(description = "摘要")
            String summary,
            @Schema(description = "Markdown 正文")
            String content,
            @Schema(description = "内容类型。school_notice 必须与 visibility=school 绑定", example = "tech_note", allowableValues = {"tech_note", "ops_manual", "study_note", "project_record", "sop", "review", "tutorial", "school_notice"})
            @NotBlank String type,
            @Schema(description = "可见性。private 后台可见；public 进入 Wiki；school 进入 School Board；unlisted 仅持链接访问", example = "private", allowableValues = {"private", "public", "school", "unlisted"})
            @NotBlank String visibility,
            @Schema(description = "发布状态", example = "draft", allowableValues = {"draft", "published", "archived"})
            @NotBlank String status,
            @Schema(description = "分类 ID")
            Long categoryId,
            @Schema(description = "项目标签 ID")
            Long projectId,
            @Schema(description = "标签 ID 列表")
            List<Long> tagIds,
            @Schema(description = "School Notice 事项日期", example = "2026-06-22")
            LocalDate eventDate,
            @Schema(description = "School Notice 开始时间", example = "09:00")
            LocalTime startTime,
            @Schema(description = "School Notice 结束时间", example = "11:00")
            LocalTime endTime,
            @Schema(description = "School Notice 截止时间", example = "2026-06-21T23:59:00")
            LocalDateTime deadlineAt,
            @Schema(description = "School Notice 地点")
            String location,
            @Schema(description = "School Notice 课程名称")
            String courseName,
            @Schema(description = "School Notice 老师")
            String teacherName,
            @Schema(description = "School Notice 优先级", example = "normal", allowableValues = {"normal", "important", "urgent"})
            String noticePriority,
            @Schema(description = "School Notice 是否已完成", example = "false")
            Boolean isNoticeDone
    ) {
    }

    @Schema(description = "内容响应对象")
    public record PostResponse(
            @Schema(description = "内容 ID", example = "1")
            Long id,
            @Schema(description = "标题")
            String title,
            @Schema(description = "Slug")
            String slug,
            @Schema(description = "摘要")
            String summary,
            @Schema(description = "Markdown 正文")
            String content,
            @Schema(description = "内容类型", allowableValues = {"tech_note", "ops_manual", "study_note", "project_record", "sop", "review", "tutorial", "school_notice"})
            String type,
            @Schema(description = "可见性", allowableValues = {"private", "public", "school", "unlisted"})
            String visibility,
            @Schema(description = "发布状态", allowableValues = {"draft", "published", "archived"})
            String status,
            @Schema(description = "分类")
            TaxonomyDtos.TaxonomyResponse category,
            @Schema(description = "项目标签")
            TaxonomyDtos.TaxonomyResponse project,
            @Schema(description = "标签列表")
            List<TaxonomyDtos.TaxonomyResponse> tags,
            @Schema(description = "附件列表")
            List<AttachmentDtos.AttachmentResponse> attachments,
            @Schema(description = "School Notice 事项日期")
            LocalDate eventDate,
            @Schema(description = "School Notice 开始时间")
            LocalTime startTime,
            @Schema(description = "School Notice 结束时间")
            LocalTime endTime,
            @Schema(description = "School Notice 截止时间")
            LocalDateTime deadlineAt,
            @Schema(description = "School Notice 地点")
            String location,
            @Schema(description = "School Notice 课程名称")
            String courseName,
            @Schema(description = "School Notice 老师")
            String teacherName,
            @Schema(description = "School Notice 优先级", allowableValues = {"normal", "important", "urgent"})
            String noticePriority,
            @Schema(description = "School Notice 状态，由后端根据时间和完成标记计算", allowableValues = {"upcoming", "ongoing", "done", "expired"})
            String noticeStatus,
            @Schema(description = "School Notice 是否已完成")
            Boolean isNoticeDone,
            @Schema(description = "创建时间")
            LocalDateTime createdAt,
            @Schema(description = "更新时间")
            LocalDateTime updatedAt,
            @Schema(description = "发布时间")
            LocalDateTime publishedAt
    ) {
    }
}
