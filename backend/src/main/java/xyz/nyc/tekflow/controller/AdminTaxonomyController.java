package xyz.nyc.tekflow.controller;

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
public class AdminTaxonomyController {
    private final TaxonomyService taxonomyService;

    public AdminTaxonomyController(TaxonomyService taxonomyService) {
        this.taxonomyService = taxonomyService;
    }

    @GetMapping("/categories")
    public ApiResponse<List<TaxonomyResponse>> categories() {
        return ApiResponse.ok(taxonomyService.categories());
    }

    @PostMapping("/categories")
    public ApiResponse<TaxonomyResponse> createCategory(@Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.createCategory(request));
    }

    @PutMapping("/categories/{id}")
    public ApiResponse<TaxonomyResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        taxonomyService.deleteCategory(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/tags")
    public ApiResponse<List<TaxonomyResponse>> tags() {
        return ApiResponse.ok(taxonomyService.tags());
    }

    @PostMapping("/tags")
    public ApiResponse<TaxonomyResponse> createTag(@Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.createTag(request));
    }

    @PutMapping("/tags/{id}")
    public ApiResponse<TaxonomyResponse> updateTag(@PathVariable Long id, @Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.updateTag(id, request));
    }

    @DeleteMapping("/tags/{id}")
    public ApiResponse<Void> deleteTag(@PathVariable Long id) {
        taxonomyService.deleteTag(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/projects")
    public ApiResponse<List<TaxonomyResponse>> projects() {
        return ApiResponse.ok(taxonomyService.projects());
    }

    @PostMapping("/projects")
    public ApiResponse<TaxonomyResponse> createProject(@Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.createProject(request));
    }

    @PutMapping("/projects/{id}")
    public ApiResponse<TaxonomyResponse> updateProject(@PathVariable Long id, @Valid @RequestBody TaxonomyRequest request) {
        return ApiResponse.ok(taxonomyService.updateProject(id, request));
    }

    @DeleteMapping("/projects/{id}")
    public ApiResponse<Void> deleteProject(@PathVariable Long id) {
        taxonomyService.deleteProject(id);
        return ApiResponse.ok(null);
    }
}

