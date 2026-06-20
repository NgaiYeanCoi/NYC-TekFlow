package xyz.nyc.tekflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import xyz.nyc.tekflow.entity.Category;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
    @Select("SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY name ASC")
    List<Category> findAllActive();

    @Select("SELECT * FROM categories WHERE id = #{id} AND deleted_at IS NULL")
    Category findActiveById(Long id);

    @Select("SELECT COUNT(*) FROM categories WHERE slug = #{slug} AND deleted_at IS NULL AND (#{excludeId} IS NULL OR id <> #{excludeId})")
    long countBySlug(@Param("slug") String slug, @Param("excludeId") Long excludeId);

    @Select("SELECT COUNT(*) FROM categories WHERE deleted_at IS NULL")
    long countActive();

    @Insert("INSERT INTO categories (name, slug, description) VALUES (#{name}, #{slug}, #{description})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertCategory(Category category);

    @Update("UPDATE categories SET name=#{name}, slug=#{slug}, description=#{description}, updated_at=CURRENT_TIMESTAMP WHERE id=#{id}")
    int updateCategory(Category category);

    @Update("UPDATE categories SET deleted_at=CURRENT_TIMESTAMP WHERE id=#{id}")
    int softDelete(Long id);
}
