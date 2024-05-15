package it.homeo.userservice.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateAppUserEmailRequest(@NotBlank(message = "Email cannot be empty") @Email(message = "Email is not a valid email") String email) { }
