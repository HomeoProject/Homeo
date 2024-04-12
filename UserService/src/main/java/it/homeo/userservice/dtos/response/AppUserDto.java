package it.homeo.userservice.dtos.response;

import lombok.Builder;

import java.time.Instant;

@Builder
public record AppUserDto(
        String id,
        String firstName,
        String lastName,
        String phoneNumber,
        String email,
        String avatar,
        boolean isBlocked,
        boolean isOnline,
        Instant lastOnlineAt,
        boolean isApproved,
        boolean isDeleted,
        Instant createdAt,
        Instant updatedAt
) { }
