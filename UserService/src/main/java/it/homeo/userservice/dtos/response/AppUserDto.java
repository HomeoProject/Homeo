package it.homeo.userservice.dtos.response;

import lombok.Builder;

import java.util.Date;
import java.util.Set;

@Builder
public record AppUserDto(
        String id,
        String firstName,
        String lastName,
        String phoneNumber,
        String email,
        String avatar,
        Set<String> authorities,
        boolean isBlocked,
        boolean isOnline,
        boolean isApproved,
        Date createdAt,
        Date updatedAt
) { }
