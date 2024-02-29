package it.homeo.userservice.dtos;

import jakarta.validation.constraints.NotNull;

public record ApproveAppUserRequest (@NotNull boolean isApproved) { }
