package xyz.nyc.tekflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.time.LocalDate;
import java.util.List;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import xyz.nyc.tekflow.entity.Post;

@Mapper
public interface PostMapper extends BaseMapper<Post> {
    @Select("""
            <script>
            SELECT * FROM posts
            WHERE deleted_at IS NULL
            <if test='keyword != null and keyword != ""'>
              AND (title LIKE CONCAT('%', #{keyword}, '%') OR summary LIKE CONCAT('%', #{keyword}, '%') OR content LIKE CONCAT('%', #{keyword}, '%'))
            </if>
            <if test='type != null and type != ""'>AND type = #{type}</if>
            <if test='visibility != null and visibility != ""'>AND visibility = #{visibility}</if>
            <if test='status != null and status != ""'>AND status = #{status}</if>
            <if test='categoryId != null'>AND category_id = #{categoryId}</if>
            <if test='projectId != null'>AND project_id = #{projectId}</if>
            <if test='tagId != null'>AND EXISTS (SELECT 1 FROM post_tags pt WHERE pt.post_id = posts.id AND pt.tag_id = #{tagId})</if>
            ORDER BY updated_at DESC
            LIMIT #{limit} OFFSET #{offset}
            </script>
            """)
    List<Post> selectAdminPosts(@Param("keyword") String keyword, @Param("type") String type,
                                @Param("visibility") String visibility, @Param("status") String status,
                                @Param("categoryId") Long categoryId, @Param("projectId") Long projectId,
                                @Param("tagId") Long tagId, @Param("limit") int limit, @Param("offset") int offset);

    @Select("""
            <script>
            SELECT COUNT(*) FROM posts
            WHERE deleted_at IS NULL
            <if test='keyword != null and keyword != ""'>
              AND (title LIKE CONCAT('%', #{keyword}, '%') OR summary LIKE CONCAT('%', #{keyword}, '%') OR content LIKE CONCAT('%', #{keyword}, '%'))
            </if>
            <if test='type != null and type != ""'>AND type = #{type}</if>
            <if test='visibility != null and visibility != ""'>AND visibility = #{visibility}</if>
            <if test='status != null and status != ""'>AND status = #{status}</if>
            <if test='categoryId != null'>AND category_id = #{categoryId}</if>
            <if test='projectId != null'>AND project_id = #{projectId}</if>
            <if test='tagId != null'>AND EXISTS (SELECT 1 FROM post_tags pt WHERE pt.post_id = posts.id AND pt.tag_id = #{tagId})</if>
            </script>
            """)
    long countAdminPosts(@Param("keyword") String keyword, @Param("type") String type,
                         @Param("visibility") String visibility, @Param("status") String status,
                         @Param("categoryId") Long categoryId, @Param("projectId") Long projectId,
                         @Param("tagId") Long tagId);

    @Select("SELECT * FROM posts WHERE id = #{id} AND deleted_at IS NULL")
    Post findActiveById(Long id);

    @Select("SELECT * FROM posts WHERE slug = #{slug} AND deleted_at IS NULL LIMIT 1")
    Post findActiveBySlug(String slug);

    @Select("SELECT COUNT(*) FROM posts WHERE slug = #{slug} AND deleted_at IS NULL AND (#{excludeId} IS NULL OR id <> #{excludeId})")
    long countBySlug(@Param("slug") String slug, @Param("excludeId") Long excludeId);

    @Select("SELECT COUNT(*) FROM posts WHERE deleted_at IS NULL")
    long countActive();

    @Select("SELECT COUNT(*) FROM posts WHERE deleted_at IS NULL AND status = #{status}")
    long countByStatus(String status);

    @Select("SELECT COUNT(*) FROM posts WHERE deleted_at IS NULL AND visibility = #{visibility}")
    long countByVisibility(String visibility);

    @Select("SELECT COUNT(*) FROM posts WHERE deleted_at IS NULL AND type = #{type}")
    long countByType(String type);

    @Select("""
            <script>
            SELECT * FROM posts
            WHERE deleted_at IS NULL AND status = 'published' AND visibility = 'public'
            <if test='keyword != null and keyword != ""'>
              AND (title LIKE CONCAT('%', #{keyword}, '%') OR summary LIKE CONCAT('%', #{keyword}, '%') OR content LIKE CONCAT('%', #{keyword}, '%'))
            </if>
            <if test='categoryId != null'>AND category_id = #{categoryId}</if>
            <if test='projectId != null'>AND project_id = #{projectId}</if>
            <if test='tagId != null'>AND EXISTS (SELECT 1 FROM post_tags pt WHERE pt.post_id = posts.id AND pt.tag_id = #{tagId})</if>
            ORDER BY published_at DESC, updated_at DESC
            LIMIT #{limit} OFFSET #{offset}
            </script>
            """)
    List<Post> selectPublicPosts(@Param("keyword") String keyword, @Param("categoryId") Long categoryId,
                                 @Param("projectId") Long projectId, @Param("tagId") Long tagId,
                                 @Param("limit") int limit, @Param("offset") int offset);

    @Select("""
            <script>
            SELECT COUNT(*) FROM posts
            WHERE deleted_at IS NULL AND status = 'published' AND visibility = 'public'
            <if test='keyword != null and keyword != ""'>
              AND (title LIKE CONCAT('%', #{keyword}, '%') OR summary LIKE CONCAT('%', #{keyword}, '%') OR content LIKE CONCAT('%', #{keyword}, '%'))
            </if>
            <if test='categoryId != null'>AND category_id = #{categoryId}</if>
            <if test='projectId != null'>AND project_id = #{projectId}</if>
            <if test='tagId != null'>AND EXISTS (SELECT 1 FROM post_tags pt WHERE pt.post_id = posts.id AND pt.tag_id = #{tagId})</if>
            </script>
            """)
    long countPublicPosts(@Param("keyword") String keyword, @Param("categoryId") Long categoryId,
                          @Param("projectId") Long projectId, @Param("tagId") Long tagId);

    @Select("SELECT * FROM posts WHERE slug = #{slug} AND deleted_at IS NULL AND status = 'published' AND visibility = 'public' LIMIT 1")
    Post findPublicBySlug(String slug);

    @Select("SELECT * FROM posts WHERE slug = #{slug} AND deleted_at IS NULL AND status = 'published' AND visibility = 'unlisted' LIMIT 1")
    Post findShareBySlug(String slug);

    @Select("""
            <script>
            SELECT * FROM posts
            WHERE deleted_at IS NULL AND status = 'published' AND visibility = 'school' AND type = 'school_notice'
            <if test='courseName != null and courseName != ""'>AND course_name LIKE CONCAT('%', #{courseName}, '%')</if>
            <if test='noticeStatus != null and noticeStatus != ""'>
              AND (
                CASE
                  WHEN is_notice_done = TRUE THEN 'done'
                  WHEN deadline_at IS NOT NULL AND deadline_at &lt; CURRENT_TIMESTAMP THEN 'expired'
                  WHEN event_date = CURRENT_DATE THEN 'ongoing'
                  ELSE 'upcoming'
                END
              ) = #{noticeStatus}
            </if>
            <if test='noticePriority != null and noticePriority != ""'>AND notice_priority = #{noticePriority}</if>
            <if test='fromDate != null'>AND COALESCE(event_date, DATE(deadline_at)) &gt;= #{fromDate}</if>
            <if test='toDate != null'>AND COALESCE(event_date, DATE(deadline_at)) &lt;= #{toDate}</if>
            ORDER BY
              CASE
                WHEN is_notice_done = TRUE THEN 3
                WHEN deadline_at IS NOT NULL AND deadline_at &lt; CURRENT_TIMESTAMP THEN 4
                WHEN deadline_at IS NOT NULL THEN 0
                WHEN event_date = CURRENT_DATE THEN 1
                WHEN event_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY) THEN 2
                ELSE 3
              END,
              CASE notice_priority WHEN 'urgent' THEN 0 WHEN 'important' THEN 1 ELSE 2 END,
              COALESCE(deadline_at, TIMESTAMP(event_date, start_time), updated_at) ASC
            LIMIT #{limit} OFFSET #{offset}
            </script>
            """)
    List<Post> selectSchoolNotices(@Param("courseName") String courseName, @Param("noticeStatus") String noticeStatus,
                                   @Param("noticePriority") String noticePriority, @Param("fromDate") LocalDate fromDate,
                                   @Param("toDate") LocalDate toDate, @Param("limit") int limit,
                                   @Param("offset") int offset);

    @Select("""
            <script>
            SELECT COUNT(*) FROM posts
            WHERE deleted_at IS NULL AND status = 'published' AND visibility = 'school' AND type = 'school_notice'
            <if test='courseName != null and courseName != ""'>AND course_name LIKE CONCAT('%', #{courseName}, '%')</if>
            <if test='noticeStatus != null and noticeStatus != ""'>
              AND (
                CASE
                  WHEN is_notice_done = TRUE THEN 'done'
                  WHEN deadline_at IS NOT NULL AND deadline_at &lt; CURRENT_TIMESTAMP THEN 'expired'
                  WHEN event_date = CURRENT_DATE THEN 'ongoing'
                  ELSE 'upcoming'
                END
              ) = #{noticeStatus}
            </if>
            <if test='noticePriority != null and noticePriority != ""'>AND notice_priority = #{noticePriority}</if>
            <if test='fromDate != null'>AND COALESCE(event_date, DATE(deadline_at)) &gt;= #{fromDate}</if>
            <if test='toDate != null'>AND COALESCE(event_date, DATE(deadline_at)) &lt;= #{toDate}</if>
            </script>
            """)
    long countSchoolNotices(@Param("courseName") String courseName, @Param("noticeStatus") String noticeStatus,
                            @Param("noticePriority") String noticePriority, @Param("fromDate") LocalDate fromDate,
                            @Param("toDate") LocalDate toDate);

    @Select("SELECT * FROM posts WHERE slug = #{slug} AND deleted_at IS NULL AND status = 'published' AND visibility = 'school' AND type = 'school_notice' LIMIT 1")
    Post findSchoolBySlug(String slug);

    @Insert("""
            INSERT INTO posts (
              title, slug, summary, content, type, visibility, status, category_id, project_id,
              event_date, start_time, end_time, deadline_at, location, course_name, teacher_name,
              notice_priority, notice_status, is_notice_done, published_at
            ) VALUES (
              #{title}, #{slug}, #{summary}, #{content}, #{type}, #{visibility}, #{status}, #{categoryId}, #{projectId},
              #{eventDate}, #{startTime}, #{endTime}, #{deadlineAt}, #{location}, #{courseName}, #{teacherName},
              #{noticePriority}, #{noticeStatus}, #{isNoticeDone}, #{publishedAt}
            )
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertPost(Post post);

    @Update("""
            UPDATE posts SET
              title=#{title}, slug=#{slug}, summary=#{summary}, content=#{content}, type=#{type},
              visibility=#{visibility}, status=#{status}, category_id=#{categoryId}, project_id=#{projectId},
              event_date=#{eventDate}, start_time=#{startTime}, end_time=#{endTime}, deadline_at=#{deadlineAt},
              location=#{location}, course_name=#{courseName}, teacher_name=#{teacherName},
              notice_priority=#{noticePriority}, notice_status=#{noticeStatus}, is_notice_done=#{isNoticeDone},
              published_at=#{publishedAt}, updated_at=CURRENT_TIMESTAMP
            WHERE id=#{id}
            """)
    int updatePost(Post post);

    @Update("UPDATE posts SET deleted_at = CURRENT_TIMESTAMP WHERE id = #{id}")
    int softDelete(Long id);
}
