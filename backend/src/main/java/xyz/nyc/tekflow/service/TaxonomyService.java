package xyz.nyc.tekflow.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import xyz.nyc.tekflow.aspect.AuditAction;
import xyz.nyc.tekflow.common.BusinessException;
import xyz.nyc.tekflow.dto.TaxonomyDtos.TaxonomyRequest;
import xyz.nyc.tekflow.dto.TaxonomyDtos.TaxonomyResponse;
import xyz.nyc.tekflow.entity.Category;
import xyz.nyc.tekflow.entity.Project;
import xyz.nyc.tekflow.entity.Tag;
import xyz.nyc.tekflow.mapper.CategoryMapper;
import xyz.nyc.tekflow.mapper.ProjectMapper;
import xyz.nyc.tekflow.mapper.TagMapper;

@Service
public class TaxonomyService {
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final ProjectMapper projectMapper;
    private final SlugService slugService;
    private final ResponseMapper responseMapper;

    public TaxonomyService(CategoryMapper categoryMapper, TagMapper tagMapper, ProjectMapper projectMapper,
                           SlugService slugService, ResponseMapper responseMapper) {
        this.categoryMapper = categoryMapper;
        this.tagMapper = tagMapper;
        this.projectMapper = projectMapper;
        this.slugService = slugService;
        this.responseMapper = responseMapper;
    }

    public List<TaxonomyResponse> categories() {
        return categoryMapper.findAllActive().stream().map(responseMapper::category).toList();
    }

    @AuditAction("category.create")
    public TaxonomyResponse createCategory(TaxonomyRequest request) {
        String slug = normalizeSlug(request);
        ensureCategorySlug(slug, null);
        Category category = new Category();
        category.setName(request.name());
        category.setSlug(slug);
        category.setDescription(request.description());
        categoryMapper.insertCategory(category);
        return responseMapper.category(category);
    }

    @AuditAction("category.update")
    public TaxonomyResponse updateCategory(Long id, TaxonomyRequest request) {
        Category category = requireCategory(id);
        String slug = normalizeSlug(request);
        ensureCategorySlug(slug, id);
        category.setName(request.name());
        category.setSlug(slug);
        category.setDescription(request.description());
        categoryMapper.updateCategory(category);
        return responseMapper.category(categoryMapper.findActiveById(id));
    }

    @AuditAction("category.delete")
    public void deleteCategory(Long id) {
        categoryMapper.softDelete(id);
    }

    public List<TaxonomyResponse> tags() {
        return tagMapper.findAllActive().stream().map(responseMapper::tag).toList();
    }

    @AuditAction("tag.create")
    public TaxonomyResponse createTag(TaxonomyRequest request) {
        String slug = normalizeSlug(request);
        ensureTagSlug(slug, null);
        Tag tag = new Tag();
        tag.setName(request.name());
        tag.setSlug(slug);
        tagMapper.insertTag(tag);
        return responseMapper.tag(tag);
    }

    @AuditAction("tag.update")
    public TaxonomyResponse updateTag(Long id, TaxonomyRequest request) {
        Tag tag = requireTag(id);
        String slug = normalizeSlug(request);
        ensureTagSlug(slug, id);
        tag.setName(request.name());
        tag.setSlug(slug);
        tagMapper.updateTag(tag);
        return responseMapper.tag(tagMapper.findActiveById(id));
    }

    @AuditAction("tag.delete")
    public void deleteTag(Long id) {
        tagMapper.softDelete(id);
    }

    public List<TaxonomyResponse> projects() {
        return projectMapper.findAllActive().stream().map(responseMapper::project).toList();
    }

    @AuditAction("project.create")
    public TaxonomyResponse createProject(TaxonomyRequest request) {
        String slug = normalizeSlug(request);
        ensureProjectSlug(slug, null);
        Project project = new Project();
        project.setName(request.name());
        project.setSlug(slug);
        project.setDescription(request.description());
        projectMapper.insertProject(project);
        return responseMapper.project(project);
    }

    @AuditAction("project.update")
    public TaxonomyResponse updateProject(Long id, TaxonomyRequest request) {
        Project project = requireProject(id);
        String slug = normalizeSlug(request);
        ensureProjectSlug(slug, id);
        project.setName(request.name());
        project.setSlug(slug);
        project.setDescription(request.description());
        projectMapper.updateProject(project);
        return responseMapper.project(projectMapper.findActiveById(id));
    }

    @AuditAction("project.delete")
    public void deleteProject(Long id) {
        projectMapper.softDelete(id);
    }

    private String normalizeSlug(TaxonomyRequest request) {
        return slugService.normalize(request.slug() == null || request.slug().isBlank() ? request.name() : request.slug());
    }

    private Category requireCategory(Long id) {
        Category category = categoryMapper.findActiveById(id);
        if (category == null) {
            throw notFound();
        }
        return category;
    }

    private Tag requireTag(Long id) {
        Tag tag = tagMapper.findActiveById(id);
        if (tag == null) {
            throw notFound();
        }
        return tag;
    }

    private Project requireProject(Long id) {
        Project project = projectMapper.findActiveById(id);
        if (project == null) {
            throw notFound();
        }
        return project;
    }

    private void ensureCategorySlug(String slug, Long excludeId) {
        if (categoryMapper.countBySlug(slug, excludeId) > 0) {
            throw conflict();
        }
    }

    private void ensureTagSlug(String slug, Long excludeId) {
        if (tagMapper.countBySlug(slug, excludeId) > 0) {
            throw conflict();
        }
    }

    private void ensureProjectSlug(String slug, Long excludeId) {
        if (projectMapper.countBySlug(slug, excludeId) > 0) {
            throw conflict();
        }
    }

    private BusinessException notFound() {
        return new BusinessException(HttpStatus.NOT_FOUND, 404, "资源不存在");
    }

    private BusinessException conflict() {
        return new BusinessException(HttpStatus.CONFLICT, 409, "slug 已存在");
    }
}

