package xyz.nyc.tekflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import xyz.nyc.tekflow.entity.Tag;

@Mapper
public interface TagMapper extends BaseMapper<Tag> {
    @Select("SELECT * FROM tags WHERE deleted_at IS NULL ORDER BY name ASC")
    List<Tag> findAllActive();

    @Select("SELECT * FROM tags WHERE id = #{id} AND deleted_at IS NULL")
    Tag findActiveById(Long id);

    @Select("SELECT t.* FROM tags t INNER JOIN post_tags pt ON pt.tag_id = t.id WHERE pt.post_id = #{postId} AND t.deleted_at IS NULL ORDER BY t.name ASC")
    List<Tag> findByPostId(Long postId);

    @Select("SELECT COUNT(*) FROM tags WHERE slug = #{slug} AND deleted_at IS NULL AND (#{excludeId} IS NULL OR id <> #{excludeId})")
    long countBySlug(@Param("slug") String slug, @Param("excludeId") Long excludeId);

    @Insert("INSERT INTO tags (name, slug) VALUES (#{name}, #{slug})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertTag(Tag tag);

    @Update("UPDATE tags SET name=#{name}, slug=#{slug}, updated_at=CURRENT_TIMESTAMP WHERE id=#{id}")
    int updateTag(Tag tag);

    @Update("UPDATE tags SET deleted_at=CURRENT_TIMESTAMP WHERE id=#{id}")
    int softDelete(Long id);
}
