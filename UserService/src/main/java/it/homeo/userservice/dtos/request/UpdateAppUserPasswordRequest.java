package it.homeo.userservice.dtos.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateAppUserPasswordRequest(@NotBlank(message = "Password cannot be empty") String password) { }
