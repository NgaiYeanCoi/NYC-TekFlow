package xyz.nyc.tekflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import xyz.nyc.tekflow.common.ApiResponse;
import xyz.nyc.tekflow.dto.AttachmentDtos.AttachmentResponse;
import xyz.nyc.tekflow.dto.PostShareDtos.ShareOpenRequest;
import xyz.nyc.tekflow.service.AttachmentService;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "附件管理与受控访问", description = "管理员上传附件，以及按 Post 权限受控下载附件")
public class AttachmentController {
    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @GetMapping("/admin/attachments")
    @Operation(summary = "查询附件列表", description = "管理员查询所有附件元数据。")
    @SecurityRequirement(name = "BearerAuth")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "查询成功，返回附件元数据列表")
    public ApiResponse<List<AttachmentResponse>> list() {
        return ApiResponse.ok(attachmentService.list());
    }

    @PostMapping(value = "/admin/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "上传附件", description = "管理员上传附件并绑定到指定 Post。附件访问权限跟随所属 Post。")
    @SecurityRequirement(name = "BearerAuth")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "上传成功，返回附件元数据")
    public ApiResponse<AttachmentResponse> upload(
            @Parameter(description = "所属 Post ID") @RequestParam Long postId,
            @Parameter(description = "待上传文件，单文件上限由后端配置控制") @RequestParam MultipartFile file
    ) {
        return ApiResponse.ok(attachmentService.upload(postId, file));
    }

    @DeleteMapping("/admin/attachments/{id}")
    @Operation(summary = "删除附件", description = "管理员按 ID 删除附件元数据和本地文件。")
    @SecurityRequirement(name = "BearerAuth")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "删除成功")
    public ApiResponse<Void> delete(@Parameter(description = "附件 ID") @PathVariable Long id) {
        attachmentService.delete(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/attachments/{id}")
    @Operation(summary = "受控下载附件", description = "统一附件访问入口。后端根据所属 Post 的 status、visibility 和登录态判断是否允许下载。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "允许访问，返回文件流")
    public ResponseEntity<Resource> download(@Parameter(description = "附件 ID") @PathVariable Long id) {
        return attachmentService.download(id);
    }

    @PostMapping("/share/posts/{token}/attachments/{id}")
    @Operation(summary = "受控下载分享附件", description = "分享页附件下载入口。后端校验分享 token、访问码、过期时间和撤销状态。")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "允许访问，返回文件流")
    public ResponseEntity<Resource> downloadShared(
            @Parameter(description = "分享 token") @PathVariable String token,
            @Parameter(description = "附件 ID") @PathVariable Long id,
            @RequestBody(required = false) ShareOpenRequest request
    ) {
        return attachmentService.downloadShared(id, token, request == null ? null : request.accessCode());
    }
}
