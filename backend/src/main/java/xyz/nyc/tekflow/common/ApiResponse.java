package xyz.nyc.tekflow.common;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "统一 API 响应包装。成功时 code 为 200，业务数据放在 data 字段。")
public record ApiResponse<T>(
        @Schema(description = "业务状态码。成功为 200；认证、权限、校验或业务错误使用非 200 code。", example = "200")
        int code,
        @Schema(description = "响应消息。前端业务判断不依赖该字段。", example = "OK")
        String msg,
        @Schema(description = "实际响应数据。列表接口通常为分页对象，失败时为 null。")
        T data
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, "OK", data);
    }

    public static <T> ApiResponse<T> error(int code, String msg) {
        return new ApiResponse<>(code, msg, null);
    }
}
