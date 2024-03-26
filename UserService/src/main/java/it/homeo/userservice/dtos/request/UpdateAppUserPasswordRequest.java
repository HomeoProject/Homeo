package it.homeo.userservice.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateAppUserPasswordRequest(@NotBlank(message = "Password cannot be empty") String password) { }
