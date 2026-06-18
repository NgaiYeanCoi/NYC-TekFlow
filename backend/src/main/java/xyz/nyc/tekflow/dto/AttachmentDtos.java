package xyz.nyc.tekflow.dto;

import java.time.LocalDateTime;

public final class AttachmentDtos {
    private AttachmentDtos() {
    }

    public record AttachmentResponse(
            Long id,
            Long postId,
            String filename,
            String originalName,
            String mimeType,
            Long size,
            LocalDateTime createdAt
    ) {
    }
}

