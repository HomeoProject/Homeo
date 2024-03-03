package it.homeo.userservice.dtos.request;

import jakarta.validation.constraints.NotNull;

public record BlockAppUserRequest(@NotNull boolean isBlocked) { }
