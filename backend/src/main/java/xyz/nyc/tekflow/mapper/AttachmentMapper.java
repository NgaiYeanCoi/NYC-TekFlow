package xyz.nyc.tekflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import xyz.nyc.tekflow.entity.Attachment;

@Mapper
public interface AttachmentMapper extends BaseMapper<Attachment> {
    @Select("SELECT * FROM attachments WHERE deleted_at IS NULL ORDER BY created_at DESC")
    List<Attachment> findAllActive();

    @Select("SELECT * FROM attachments WHERE post_id = #{postId} AND deleted_at IS NULL ORDER BY created_at DESC")
    List<Attachment> findByPostId(Long postId);

    @Select("SELECT * FROM attachments WHERE id = #{id} AND deleted_at IS NULL")
    Attachment findActiveById(Long id);

    @Select("SELECT COUNT(*) FROM attachments WHERE deleted_at IS NULL")
    long countActive();

    @Insert("""
            INSERT INTO attachments (post_id, filename, original_name, mime_type, size, path)
            VALUES (#{postId}, #{filename}, #{originalName}, #{mimeType}, #{size}, #{path})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertAttachment(Attachment attachment);

    @Update("UPDATE attachments SET deleted_at = CURRENT_TIMESTAMP WHERE id = #{id}")
    int softDelete(Long id);
}
