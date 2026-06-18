package xyz.nyc.tekflow.dto;

import jakarta.validation.constraints.NotBlank;

public final class TaxonomyDtos {
    private TaxonomyDtos() {
    }

    public record TaxonomyRequest(
            @NotBlank String name,
            String slug,
            String description
    ) {
    }

    public record TaxonomyResponse(
            Long id,
            String name,
            String slug,
            String description
    ) {
    }
}

