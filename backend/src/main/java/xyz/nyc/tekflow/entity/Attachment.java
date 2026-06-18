package xyz.nyc.tekflow.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("attachments")
public class Attachment {
    private Long id;
    private Long postId;
    private String filename;
    private String originalName;
    private String mimeType;
    private Long size;
    private String path;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
}

