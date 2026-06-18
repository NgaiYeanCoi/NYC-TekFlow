package xyz.nyc.tekflow.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostTagMapper {
    @Delete("DELETE FROM post_tags WHERE post_id = #{postId}")
    int deleteByPostId(Long postId);

    @Insert("INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (#{postId}, #{tagId})")
    int insert(@Param("postId") Long postId, @Param("tagId") Long tagId);
}
