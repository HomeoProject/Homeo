package it.homeo.userservice.dtos.request;

import jakarta.validation.constraints.NotNull;

public record BlockAppUserRequest(@NotNull(message = "Field cannot be null") Boolean isBlocked) { }
