package it.homeo.userservice.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateAppUserEmailRequest(@NotBlank @Email String email) { }
