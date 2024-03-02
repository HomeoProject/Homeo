package it.homeo.userservice.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record UpdateAppUserRequest(
        @NotBlank
        @NotNull
        String firstName,

        @NotBlank
        @NotNull
        String lastName,

        @NotBlank
        @NotNull
        String phoneNumber
) { }
