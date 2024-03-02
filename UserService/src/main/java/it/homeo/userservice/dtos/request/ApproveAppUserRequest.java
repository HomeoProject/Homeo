package it.homeo.userservice.dtos.request;

import jakarta.validation.constraints.NotNull;

public record ApproveAppUserRequest (@NotNull boolean isApproved) { }
