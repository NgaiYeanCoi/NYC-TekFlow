package xyz.nyc.tekflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

public final class PostShareDtos {
    private PostShareDtos() {
    }

    @Schema(description = "后台开启或更新链接分享的请求")
    public record PostShareRequest(
            @Schema(description = "可选访问码；为空且 clearAccessCode=false 时保留原访问码")
            String accessCode,
            @Schema(description = "是否清除访问码", example = "false")
            Boolean clearAccessCode,
            @Schema(description = "分享过期时间；为空时新分享默认 7 天后过期")
            LocalDateTime expiresAt,
            @Schema(description = "是否永不过期；true 时忽略 expiresAt", example = "false")
            Boolean neverExpires
    ) {
    }

    @Schema(description = "公开打开分享内容或附件时提交的访问码")
    public record ShareOpenRequest(
            @Schema(description = "访问码；无访问码分享可留空")
            String accessCode
    ) {
    }

    @Schema(description = "后台分享状态与统计")
    public record PostShareResponse(
            @Schema(description = "所属 Post ID")
            Long postId,
            @Schema(description = "分享 token；前端拼接为 /share/{token}")
            String token,
            @Schema(description = "分享状态：active、revoked、none", allowableValues = {"active", "revoked", "none"})
            String status,
            @Schema(description = "当前是否可访问")
            boolean active,
            @Schema(description = "是否设置访问码")
            boolean hasAccessCode,
            @Schema(description = "过期时间；null 表示永不过期")
            LocalDateTime expiresAt,
            @Schema(description = "是否已过期")
            boolean expired,
            @Schema(description = "成功打开详情次数")
            long accessCount,
            @Schema(description = "附件下载次数")
            long attachmentDownloadCount,
            @Schema(description = "最后成功访问时间")
            LocalDateTime lastAccessedAt,
            @Schema(description = "撤销时间")
            LocalDateTime revokedAt,
            @Schema(description = "创建时间")
            LocalDateTime createdAt,
            @Schema(description = "更新时间")
            LocalDateTime updatedAt
    ) {
    }

    @Schema(description = "分享门禁信息；不计入访问次数")
    public record ShareMetaResponse(
            @Schema(description = "分享状态：active、revoked、expired", allowableValues = {"active", "revoked", "expired"})
            String status,
            @Schema(description = "是否需要访问码")
            boolean requiresAccessCode,
            @Schema(description = "过期时间；null 表示永不过期")
            LocalDateTime expiresAt,
            @Schema(description = "是否已过期")
            boolean expired,
            @Schema(description = "是否已撤销")
            boolean revoked,
            @Schema(description = "内容标题；仅用于门禁页展示")
            String title
    ) {
    }
}
