package xyz.nyc.tekflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.nyc.tekflow.common.ApiResponse;
import xyz.nyc.tekflow.dto.TaxonomyDtos.TaxonomyBundleResponse;
import xyz.nyc.tekflow.service.TaxonomyService;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "公开基础字典", description = "公开页面筛选使用的分类、标签和项目标签只读接口")
public class PublicTaxonomyController {
    private final TaxonomyService taxonomyService;

    public PublicTaxonomyController(TaxonomyService taxonomyService) {
        this.taxonomyService = taxonomyService;
    }

    @GetMapping("/taxonomies")
    @Operation(summary = "查询公开筛选字典", description = "返回 Wiki 等公开页面筛选所需的分类、标签和项目标签。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回分类、标签和项目标签集合")
    public ApiResponse<TaxonomyBundleResponse> taxonomies() {
        return ApiResponse.ok(taxonomyService.bundle());
    }
}
