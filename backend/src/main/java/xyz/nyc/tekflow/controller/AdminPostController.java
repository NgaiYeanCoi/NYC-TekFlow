package xyz.nyc.tekflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xyz.nyc.tekflow.common.ApiResponse;
import xyz.nyc.tekflow.common.PageResponse;
import xyz.nyc.tekflow.dto.PostDtos.PostRequest;
import xyz.nyc.tekflow.dto.PostDtos.PostResponse;
import xyz.nyc.tekflow.dto.PostDtos.PostSummaryResponse;
import xyz.nyc.tekflow.service.PostService;

@RestController
@RequestMapping("/api/v1/admin/posts")
@Tag(name = "后台内容管理", description = "管理员维护普通 Post 与 School Notice 的接口")
@SecurityRequirement(name = "BearerAuth")
public class AdminPostController {
    private final PostService postService;

    public AdminPostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    @Operation(summary = "分页查询后台内容", description = "查询管理员可见的全部内容，支持关键词、类型、可见性、状态、分类、项目和标签筛选。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回分页内容列表")
    public ApiResponse<PageResponse<PostResponse>> list(
            @Parameter(description = "关键词，匹配标题、摘要或正文") @RequestParam(required = false) String keyword,
            @Parameter(description = "内容类型，如 tech_note、ops_manual、school_notice") @RequestParam(required = false) String type,
            @Parameter(description = "可见性：private、public、school、unlisted") @RequestParam(required = false) String visibility,
            @Parameter(description = "发布状态：draft、published、archived") @RequestParam(required = false) String status,
            @Parameter(description = "分类 ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "项目标签 ID") @RequestParam(required = false) Long projectId,
            @Parameter(description = "标签 ID") @RequestParam(required = false) Long tagId,
            @Parameter(description = "页码，从 1 开始") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ApiResponse.ok(postService.adminPosts(keyword, type, visibility, status, categoryId, projectId, tagId, page, pageSize));
    }

    @GetMapping("/summary")
    @Operation(summary = "查询后台内容统计", description = "返回工作台首页和设置页使用的真实内容、附件和基础字典统计。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回统计摘要")
    public ApiResponse<PostSummaryResponse> summary() {
        return ApiResponse.ok(postService.adminSummary());
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取后台内容详情", description = "按 ID 获取管理员可见的 Post 详情，包含分类、项目、标签、附件和 School Notice 字段。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回内容详情")
    public ApiResponse<PostResponse> detail(@Parameter(description = "Post ID") @PathVariable Long id) {
        return ApiResponse.ok(postService.adminPost(id));
    }

    @PostMapping
    @Operation(summary = "创建内容", description = "创建普通 Post 或 School Notice。School Notice 必须与 visibility=school 绑定。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "创建成功，返回创建后的内容")
    public ApiResponse<PostResponse> create(@Valid @RequestBody PostRequest request) {
        return ApiResponse.ok(postService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新内容", description = "更新指定 Post 的标题、正文、分类、标签、项目、可见性、状态和 School Notice 字段。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功，返回更新后的内容")
    public ApiResponse<PostResponse> update(@Parameter(description = "Post ID") @PathVariable Long id, @Valid @RequestBody PostRequest request) {
        return ApiResponse.ok(postService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除内容", description = "按 ID 删除后台内容。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "删除成功")
    public ApiResponse<Void> delete(@Parameter(description = "Post ID") @PathVariable Long id) {
        postService.delete(id);
        return ApiResponse.ok(null);
    }
}
