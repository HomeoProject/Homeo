package it.homeo.userservice.dtos;

import jakarta.validation.constraints.NotNull;

public record UpdateAppUserIsConstructorRequest(@NotNull boolean isConstructor) { }
