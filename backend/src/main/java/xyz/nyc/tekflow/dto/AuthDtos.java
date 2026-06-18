package xyz.nyc.tekflow.dto;

import jakarta.validation.constraints.NotBlank;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password
    ) {
    }

    public record UserSummary(
            Long id,
            String username,
            String name,
            String email,
            String role
    ) {
    }

    public record LoginResponse(
            String token,
            long expiresAt,
            UserSummary user
    ) {
    }
}

