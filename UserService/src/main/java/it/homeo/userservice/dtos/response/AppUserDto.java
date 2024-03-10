package it.homeo.userservice.dtos.response;

import lombok.Builder;

import java.util.Date;

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
        Date createdAt,
        Date updatedAt
) { }
