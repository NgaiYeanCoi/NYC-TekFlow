package xyz.nyc.tekflow.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("post_shares")
public class PostShare {
    private Long id;
    private Long postId;
    private String token;
    private String accessCodeHash;
    private LocalDateTime expiresAt;
    private String status;
    private Long accessCount;
    private Long attachmentDownloadCount;
    private LocalDateTime lastAccessedAt;
    private LocalDateTime revokedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
