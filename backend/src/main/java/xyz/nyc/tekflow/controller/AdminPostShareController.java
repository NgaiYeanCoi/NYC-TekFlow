package xyz.nyc.tekflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.nyc.tekflow.common.ApiResponse;
import xyz.nyc.tekflow.dto.PostShareDtos.PostShareRequest;
import xyz.nyc.tekflow.dto.PostShareDtos.PostShareResponse;
import xyz.nyc.tekflow.service.PostShareService;

@RestController
@RequestMapping("/api/v1/admin/posts")
@Tag(name = "后台链接分享", description = "管理员开启、撤销、重新生成和查看 unlisted 内容分享统计")
@SecurityRequirement(name = "BearerAuth")
public class AdminPostShareController {
    private final PostShareService postShareService;

    public AdminPostShareController(PostShareService postShareService) {
        this.postShareService = postShareService;
    }

    @GetMapping("/{id}/share")
    @Operation(summary = "查询内容分享状态", description = "查询指定 Post 的分享 token、访问码状态、过期时间和访问统计。")
    public ApiResponse<PostShareResponse> detail(@Parameter(description = "Post ID") @PathVariable Long id) {
        return ApiResponse.ok(postShareService.adminShare(id));
    }

    @PostMapping("/{id}/share")
    @Operation(summary = "开启或更新内容分享", description = "仅允许已发布的持链接访问内容开启分享。默认 7 天后过期。")
    public ApiResponse<PostShareResponse> enable(
            @Parameter(description = "Post ID") @PathVariable Long id,
            @RequestBody(required = false) PostShareRequest request
    ) {
        return ApiResponse.ok(postShareService.enableOrUpdate(id, request));
    }

    @DeleteMapping("/{id}/share")
    @Operation(summary = "撤销内容分享", description = "撤销后旧分享链接和对应附件访问立即失效。")
    public ApiResponse<PostShareResponse> revoke(@Parameter(description = "Post ID") @PathVariable Long id) {
        return ApiResponse.ok(postShareService.revoke(id));
    }

    @PostMapping("/{id}/share/rotate")
    @Operation(summary = "重新生成分享链接", description = "生成新的分享 token，并使旧 token 失效。")
    public ApiResponse<PostShareResponse> rotate(@Parameter(description = "Post ID") @PathVariable Long id) {
        return ApiResponse.ok(postShareService.rotate(id));
    }
}
