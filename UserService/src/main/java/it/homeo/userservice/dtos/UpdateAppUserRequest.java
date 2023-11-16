package it.homeo.userservice.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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
