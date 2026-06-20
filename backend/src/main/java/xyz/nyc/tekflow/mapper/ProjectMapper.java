package xyz.nyc.tekflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import xyz.nyc.tekflow.entity.Project;

@Mapper
public interface ProjectMapper extends BaseMapper<Project> {
    @Select("SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY name ASC")
    List<Project> findAllActive();

    @Select("SELECT * FROM projects WHERE id = #{id} AND deleted_at IS NULL")
    Project findActiveById(Long id);

    @Select("SELECT COUNT(*) FROM projects WHERE slug = #{slug} AND deleted_at IS NULL AND (#{excludeId} IS NULL OR id <> #{excludeId})")
    long countBySlug(@Param("slug") String slug, @Param("excludeId") Long excludeId);

    @Select("SELECT COUNT(*) FROM projects WHERE deleted_at IS NULL")
    long countActive();

    @Insert("INSERT INTO projects (name, slug, description) VALUES (#{name}, #{slug}, #{description})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertProject(Project project);

    @Update("UPDATE projects SET name=#{name}, slug=#{slug}, description=#{description}, updated_at=CURRENT_TIMESTAMP WHERE id=#{id}")
    int updateProject(Project project);

    @Update("UPDATE projects SET deleted_at=CURRENT_TIMESTAMP WHERE id=#{id}")
    int softDelete(Long id);
}
