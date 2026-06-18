package xyz.nyc.tekflow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xyz.nyc.tekflow.common.ApiResponse;
import xyz.nyc.tekflow.common.PageResponse;
import xyz.nyc.tekflow.dto.PostDtos.PostResponse;
import xyz.nyc.tekflow.service.PostService;

@RestController
@RequestMapping("/api/v1")
public class PublicPostController {
    private final PostService postService;

    public PublicPostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/wiki/posts")
    public ApiResponse<PageResponse<PostResponse>> wikiPosts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long tagId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ApiResponse.ok(postService.wikiPosts(keyword, categoryId, projectId, tagId, page, pageSize));
    }

    @GetMapping("/wiki/posts/{slug}")
    public ApiResponse<PostResponse> wikiPost(@PathVariable String slug) {
        return ApiResponse.ok(postService.wikiPost(slug));
    }

    @GetMapping("/share/posts/{slug}")
    public ApiResponse<PostResponse> sharePost(@PathVariable String slug) {
        return ApiResponse.ok(postService.sharePost(slug));
    }

    @GetMapping("/school/notices")
    public ApiResponse<PageResponse<PostResponse>> schoolNotices(
            @RequestParam(required = false) String courseName,
            @RequestParam(required = false) String noticeStatus,
            @RequestParam(required = false) String noticePriority,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize
    ) {
        return ApiResponse.ok(postService.schoolNotices(courseName, noticeStatus, noticePriority, page, pageSize));
    }

    @GetMapping("/school/notices/{slug}")
    public ApiResponse<PostResponse> schoolNotice(@PathVariable String slug) {
        return ApiResponse.ok(postService.schoolNotice(slug));
    }
}

