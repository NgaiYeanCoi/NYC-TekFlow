package xyz.nyc.tekflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public final class AuthDtos {
    private AuthDtos() {
    }

    @Schema(description = "管理员登录请求")
    public record LoginRequest(
            @Schema(description = "管理员用户名", example = "admin")
            @NotBlank String username,
            @Schema(description = "管理员密码", example = "your-password")
            @NotBlank String password
    ) {
    }

    @Schema(description = "当前登录用户摘要")
    public record UserSummary(
            @Schema(description = "用户 ID", example = "1")
            Long id,
            @Schema(description = "用户名", example = "admin")
            String username,
            @Schema(description = "显示名称", example = "TekFlow Admin")
            String name,
            @Schema(description = "邮箱，可为空", example = "admin@example.com")
            String email,
            @Schema(description = "角色", example = "ADMIN")
            String role
    ) {
    }

    @Schema(description = "管理员登录响应")
    public record LoginResponse(
            @Schema(description = "后端签发的 JWT token")
            String token,
            @Schema(description = "过期时间戳，单位为毫秒", example = "1760000000000")
            long expiresAt,
            @Schema(description = "登录用户摘要")
            UserSummary user
    ) {
    }
}
