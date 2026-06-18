package xyz.nyc.tekflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.nyc.tekflow.common.ApiResponse;
import xyz.nyc.tekflow.dto.TaxonomyDtos.TaxonomyRequest;
import xyz.nyc.tekflow.dto.TaxonomyDtos.TaxonomyResponse;
import xyz.nyc.tekflow.service.TaxonomyService;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "后台基础字典管理", description = "管理员维护分类、标签和项目标签的接口")
@SecurityRequirement(name = "BearerAuth")
public class AdminTaxonomyController {
    private final TaxonomyService taxonomyService;

    public AdminTaxonomyController(TaxonomyService taxonomyService) {
        this.taxonomyService = taxonomyService;
    }

    @GetMapping("/categories")
    @Operation(summary = "查询分类列表", description = "查询全部内容分类。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回分类列表")
    public ApiResponse<List<TaxonomyResponse>> categories() {
        return ApiResponse.ok(taxonomyService.categories());
    }

    @PostMapping("/categories")
    @Operation(summary = "创建分类", description = "创建一个内容分类。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "创建成功，返回分类")
    public ApiResponse<TaxonomyResponse> createCategory(@Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.createCategory(request));
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "更新分类", description = "按 ID 更新分类。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功，返回分类")
    public ApiResponse<TaxonomyResponse> updateCategory(@Parameter(description = "分类 ID") @PathVariable Long id, @Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "删除分类", description = "按 ID 删除分类。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "删除成功")
    public ApiResponse<Void> deleteCategory(@Parameter(description = "分类 ID") @PathVariable Long id) {
        taxonomyService.deleteCategory(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/tags")
    @Operation(summary = "查询标签列表", description = "查询全部内容标签。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回标签列表")
    public ApiResponse<List<TaxonomyResponse>> tags() {
        return ApiResponse.ok(taxonomyService.tags());
    }

    @PostMapping("/tags")
    @Operation(summary = "创建标签", description = "创建一个内容标签。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "创建成功，返回标签")
    public ApiResponse<TaxonomyResponse> createTag(@Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.createTag(request));
    }

    @PutMapping("/tags/{id}")
    @Operation(summary = "更新标签", description = "按 ID 更新标签。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功，返回标签")
    public ApiResponse<TaxonomyResponse> updateTag(@Parameter(description = "标签 ID") @PathVariable Long id, @Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.updateTag(id, request));
    }

    @DeleteMapping("/tags/{id}")
    @Operation(summary = "删除标签", description = "按 ID 删除标签。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "删除成功")
    public ApiResponse<Void> deleteTag(@Parameter(description = "标签 ID") @PathVariable Long id) {
        taxonomyService.deleteTag(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/projects")
    @Operation(summary = "查询项目标签列表", description = "查询全部项目标签。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回项目标签列表")
    public ApiResponse<List<TaxonomyResponse>> projects() {
        return ApiResponse.ok(taxonomyService.projects());
    }

    @PostMapping("/projects")
    @Operation(summary = "创建项目标签", description = "创建一个项目标签。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "创建成功，返回项目标签")
    public ApiResponse<TaxonomyResponse> createProject(@Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.createProject(request));
    }

    @PutMapping("/projects/{id}")
    @Operation(summary = "更新项目标签", description = "按 ID 更新项目标签。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功，返回项目标签")
    public ApiResponse<TaxonomyResponse> updateProject(@Parameter(description = "项目标签 ID") @PathVariable Long id, @Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.updateProject(id, request));
    }

    @DeleteMapping("/projects/{id}")
    @Operation(summary = "删除项目标签", description = "按 ID 删除项目标签。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "删除成功")
    public ApiResponse<Void> deleteProject(@Parameter(description = "项目标签 ID") @PathVariable Long id) {
        taxonomyService.deleteProject(id);
        return ApiResponse.ok(null);
    }
}
