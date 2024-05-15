package it.homeo.searchservice.dtos.request;

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
        boolean isApproved,
        boolean isDeleted,
        Instant lastOnlineAt,
        Instant createdAt,
        Instant updatedAt
) { }
