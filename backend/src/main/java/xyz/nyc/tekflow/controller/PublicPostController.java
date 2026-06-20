package xyz.nyc.tekflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xyz.nyc.tekflow.common.ApiResponse;
import xyz.nyc.tekflow.common.PageResponse;
import xyz.nyc.tekflow.dto.PostDtos.PostResponse;
import xyz.nyc.tekflow.dto.PostShareDtos.ShareMetaResponse;
import xyz.nyc.tekflow.dto.PostShareDtos.ShareOpenRequest;
import xyz.nyc.tekflow.service.PostService;
import xyz.nyc.tekflow.service.PostShareService;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "公开内容访问", description = "游客访问 Wiki、School Board 和 unlisted 链接内容的接口")
public class PublicPostController {
    private final PostService postService;
    private final PostShareService postShareService;

    public PublicPostController(PostService postService, PostShareService postShareService) {
        this.postService = postService;
        this.postShareService = postShareService;
    }

    @GetMapping("/wiki/posts")
    @Operation(summary = "分页查询公开 Wiki 内容", description = "只返回 status=published、visibility=public 且未删除的内容。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回公开内容分页列表")
    public ApiResponse<PageResponse<PostResponse>> wikiPosts(
            @Parameter(description = "关键词，匹配标题、摘要或正文") @RequestParam(required = false) String keyword,
            @Parameter(description = "分类 ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "项目标签 ID") @RequestParam(required = false) Long projectId,
            @Parameter(description = "标签 ID") @RequestParam(required = false) Long tagId,
            @Parameter(description = "页码，从 1 开始") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ApiResponse.ok(postService.wikiPosts(keyword, categoryId, projectId, tagId, page, pageSize));
    }

    @GetMapping("/wiki/posts/{slug}")
    @Operation(summary = "获取公开 Wiki 详情", description = "通过 slug 访问公开 Wiki 内容详情。private、school、unlisted 内容不会通过该接口返回。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回公开内容详情")
    public ApiResponse<PostResponse> wikiPost(@Parameter(description = "Post slug") @PathVariable String slug) {
        return ApiResponse.ok(postService.wikiPost(slug));
    }

    @GetMapping("/share/posts/{token}/meta")
    @Operation(summary = "获取分享门禁信息", description = "通过分享 token 查询是否需要访问码、是否过期或撤销；不计入访问次数。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回分享门禁信息")
    public ApiResponse<ShareMetaResponse> shareMeta(@Parameter(description = "分享 token") @PathVariable String token) {
        return ApiResponse.ok(postShareService.meta(token));
    }

    @PostMapping("/share/posts/{token}/open")
    @Operation(summary = "打开分享内容", description = "校验 token、访问码、过期时间和撤销状态，成功后计入访问次数并返回内容详情。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "校验成功，返回分享内容详情")
    public ApiResponse<PostResponse> openShare(
            @Parameter(description = "分享 token") @PathVariable String token,
            @RequestBody(required = false) ShareOpenRequest request
    ) {
        return ApiResponse.ok(postShareService.open(token, request));
    }

    @GetMapping("/school/notices")
    @Operation(summary = "分页查询 School Notice", description = "只返回 status=published、visibility=school、type=school_notice 且未删除的学校事项。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回 School Notice 分页列表")
    public ApiResponse<PageResponse<PostResponse>> schoolNotices(
            @Parameter(description = "课程名称") @RequestParam(required = false) String courseName,
            @Parameter(description = "事项状态：upcoming、ongoing、done、expired") @RequestParam(required = false) String noticeStatus,
            @Parameter(description = "优先级：normal、important、urgent") @RequestParam(required = false) String noticePriority,
            @Parameter(description = "日期范围开始，匹配事项日期或截止日期") @RequestParam(required = false) LocalDate fromDate,
            @Parameter(description = "日期范围结束，匹配事项日期或截止日期") @RequestParam(required = false) LocalDate toDate,
            @Parameter(description = "页码，从 1 开始") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "20") int pageSize
    ) {
        return ApiResponse.ok(postService.schoolNotices(courseName, noticeStatus, noticePriority, fromDate, toDate, page, pageSize));
    }

    @GetMapping("/school/notices/{slug}")
    @Operation(summary = "获取 School Notice 详情", description = "通过 slug 访问已发布的学校事项详情。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回 School Notice 详情")
    public ApiResponse<PostResponse> schoolNotice(@Parameter(description = "School Notice slug") @PathVariable String slug) {
        return ApiResponse.ok(postService.schoolNotice(slug));
    }
}
