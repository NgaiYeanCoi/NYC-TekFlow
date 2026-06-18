package xyz.nyc.tekflow.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.Data;

@Data
@TableName("posts")
public class Post {
    private Long id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String type;
    private String visibility;
    private String status;
    private Long categoryId;
    private Long projectId;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDateTime deadlineAt;
    private String location;
    private String courseName;
    private String teacherName;
    private String noticePriority;
    private String noticeStatus;
    private Boolean isNoticeDone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    private LocalDateTime deletedAt;
}

