package it.homeo.userservice.dtos;

import java.util.Date;

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
        Date createdAt,
        Date updatedAt
) { }
