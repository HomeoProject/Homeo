package it.homeo.chatservice.dtos.request;

import java.time.Instant;

public record AppUserDto(
        String id,
        String firstName,
        String lastName,
        String phoneNumber,
        String email,
        String avatar,
        boolean isBlocked,
        boolean isOnline,
        boolean isApproved,
        boolean isDeleted,
        Instant lastOnlineAt,
        Instant createdAt,
        Instant updatedAt
) { }
