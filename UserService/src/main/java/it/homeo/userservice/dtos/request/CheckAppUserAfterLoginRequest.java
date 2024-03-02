package it.homeo.userservice.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CheckAppUserAfterLoginRequest(
        @NotBlank
        String id,

        @NotBlank
        @Email
        String email,

        @NotBlank
        String avatar,

        @NotNull
        boolean isBlocked
) { }
