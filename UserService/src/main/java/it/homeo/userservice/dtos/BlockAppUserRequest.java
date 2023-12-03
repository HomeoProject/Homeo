package it.homeo.userservice.dtos;

import jakarta.validation.constraints.NotNull;

public record BlockAppUserRequest(@NotNull boolean isBlocked) { }
