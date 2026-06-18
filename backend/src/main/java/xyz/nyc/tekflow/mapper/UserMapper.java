package xyz.nyc.tekflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import xyz.nyc.tekflow.entity.User;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    @Select("SELECT * FROM users WHERE username = #{username} AND deleted_at IS NULL LIMIT 1")
    User findByUsername(String username);

    @Select("SELECT * FROM users WHERE username = #{username} AND enabled = TRUE AND deleted_at IS NULL LIMIT 1")
    User findActiveByUsername(String username);

    @Insert("""
            INSERT INTO users (username, name, email, password_hash, role, enabled)
            VALUES (#{username}, #{name}, #{email}, #{passwordHash}, #{role}, #{enabled})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertUser(User user);

    @Update("""
            UPDATE users
            SET name = #{name}, email = #{email}, password_hash = #{passwordHash}, role = #{role},
                enabled = #{enabled}, updated_at = CURRENT_TIMESTAMP
            WHERE id = #{id}
            """)
    int updateUser(User user);
}

