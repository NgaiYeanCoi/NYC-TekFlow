package xyz.nyc.tekflow.controller;

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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import xyz.nyc.tekflow.common.ApiResponse;
import xyz.nyc.tekflow.dto.AttachmentDtos.AttachmentResponse;
import xyz.nyc.tekflow.service.AttachmentService;

@RestController
@RequestMapping("/api/v1")
public class AttachmentController {
    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @GetMapping("/admin/attachments")
    public ApiResponse<List<AttachmentResponse>> list() {
        return ApiResponse.ok(attachmentService.list());
    }

    @PostMapping(value = "/admin/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<AttachmentResponse> upload(@RequestParam Long postId, @RequestParam MultipartFile file) {
        return ApiResponse.ok(attachmentService.upload(postId, file));
    }

    @DeleteMapping("/admin/attachments/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        attachmentService.delete(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/attachments/{id}")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        return attachmentService.download(id);
    }
}

