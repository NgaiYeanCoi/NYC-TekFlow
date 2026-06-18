package xyz.nyc.tekflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

public final class AttachmentDtos {
    private AttachmentDtos() {
    }

    @Schema(description = "附件元数据响应对象。附件实际访问统一通过受控下载接口。")
    public record AttachmentResponse(
            @Schema(description = "附件 ID", example = "1")
            Long id,
            @Schema(description = "所属 Post ID", example = "1")
            Long postId,
            @Schema(description = "服务端保存文件名")
            String filename,
            @Schema(description = "原始文件名", example = "deploy-note.pdf")
            String originalName,
            @Schema(description = "MIME 类型", example = "application/pdf")
            String mimeType,
            @Schema(description = "文件大小，单位字节", example = "102400")
            Long size,
            @Schema(description = "上传时间")
            LocalDateTime createdAt
    ) {
    }
}
