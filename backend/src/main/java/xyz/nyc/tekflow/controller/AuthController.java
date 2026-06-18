package xyz.nyc.tekflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.nyc.tekflow.common.ApiResponse;
import xyz.nyc.tekflow.dto.AuthDtos.LoginRequest;
import xyz.nyc.tekflow.dto.AuthDtos.LoginResponse;
import xyz.nyc.tekflow.dto.AuthDtos.UserSummary;
import xyz.nyc.tekflow.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "认证与用户", description = "管理员登录、当前用户信息接口")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "管理员登录", description = "使用管理员 username 和密码登录，成功后返回后端 JWT。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "登录成功，返回 token、过期时间和用户信息")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(authService.login(request));
    }

    @GetMapping("/me")
    @Operation(summary = "获取当前用户", description = "根据 Authorization Bearer token 获取当前管理员用户信息。")
    @SecurityRequirement(name = "BearerAuth")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回当前用户摘要")
    public ApiResponse<UserSummary> me() {
        return ApiResponse.ok(authService.currentUser());
    }
}
