package xyz.nyc.tekflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import xyz.nyc.tekflow.entity.PostShare;

@Mapper
public interface PostShareMapper extends BaseMapper<PostShare> {
    @Select("SELECT * FROM post_shares WHERE post_id = #{postId} AND deleted_at IS NULL ORDER BY id DESC LIMIT 1")
    PostShare findLatestByPostId(Long postId);

    @Select("SELECT * FROM post_shares WHERE token = #{token} AND deleted_at IS NULL LIMIT 1")
    PostShare findByToken(String token);

    @Select("SELECT COUNT(*) FROM post_shares WHERE token = #{token} AND deleted_at IS NULL")
    long countByToken(String token);

    @Insert("""
            INSERT INTO post_shares (
              post_id, token, access_code_hash, expires_at, status,
              access_count, attachment_download_count
            ) VALUES (
              #{postId}, #{token}, #{accessCodeHash}, #{expiresAt}, #{status},
              #{accessCount}, #{attachmentDownloadCount}
            )
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertShare(PostShare share);

    @Update("""
            UPDATE post_shares SET
              token = #{token},
              access_code_hash = #{accessCodeHash},
              expires_at = #{expiresAt},
              status = #{status},
              revoked_at = #{revokedAt},
              updated_at = CURRENT_TIMESTAMP
            WHERE id = #{id}
            """)
    int updateShare(PostShare share);

    @Update("""
            UPDATE post_shares SET
              status = 'revoked',
              revoked_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = #{id}
            """)
    int revoke(Long id);

    @Update("""
            UPDATE post_shares SET
              access_count = access_count + 1,
              last_accessed_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = #{id}
            """)
    int incrementAccess(Long id);

    @Update("""
            UPDATE post_shares SET
              attachment_download_count = attachment_download_count + 1,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = #{id}
            """)
    int incrementAttachmentDownload(Long id);

    @Update("UPDATE post_shares SET deleted_at = CURRENT_TIMESTAMP WHERE post_id = #{postId} AND deleted_at IS NULL")
    int softDeleteByPostId(@Param("postId") Long postId);
}
