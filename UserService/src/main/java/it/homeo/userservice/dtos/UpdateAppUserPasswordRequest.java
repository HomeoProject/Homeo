package it.homeo.userservice.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateAppUserPasswordRequest(@NotBlank @NotNull String password) { }
