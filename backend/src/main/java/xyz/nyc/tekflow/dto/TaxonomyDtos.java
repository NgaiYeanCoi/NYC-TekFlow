package xyz.nyc.tekflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public final class TaxonomyDtos {
    private TaxonomyDtos() {
    }

    @Schema(description = "分类、标签或项目标签创建/更新请求")
    public record TaxonomyRequest(
            @Schema(description = "名称", example = "技术沉淀")
            @NotBlank String name,
            @Schema(description = "Slug。留空时可根据名称生成", example = "tech-notes")
            String slug,
            @Schema(description = "描述")
            String description
    ) {
    }

    @Schema(description = "分类、标签或项目标签响应对象")
    public record TaxonomyResponse(
            @Schema(description = "ID", example = "1")
            Long id,
            @Schema(description = "名称", example = "技术沉淀")
            String name,
            @Schema(description = "Slug", example = "tech-notes")
            String slug,
            @Schema(description = "描述")
            String description
    ) {
    }

    @Schema(description = "公开筛选所需的分类、标签和项目标签集合")
    public record TaxonomyBundleResponse(
            @Schema(description = "分类列表")
            List<TaxonomyResponse> categories,
            @Schema(description = "标签列表")
            List<TaxonomyResponse> tags,
            @Schema(description = "项目标签列表")
            List<TaxonomyResponse> projects
    ) {
    }
}
