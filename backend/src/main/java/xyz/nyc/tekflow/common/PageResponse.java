package xyz.nyc.tekflow.common;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "分页响应对象。列表数据统一放在 items 中。")
public record PageResponse<T>(
        @Schema(description = "当前页数据列表")
        List<T> items,
        @Schema(description = "符合筛选条件的数据总数", example = "42")
        long total,
        @Schema(description = "当前页码，从 1 开始", example = "1")
        int page,
        @Schema(description = "每页数量", example = "20")
        int pageSize
) {
}
