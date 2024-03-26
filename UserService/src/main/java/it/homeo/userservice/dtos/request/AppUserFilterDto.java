package it.homeo.userservice.dtos.request;

public record AppUserFilterDto(
        String id,
        String firstName,
        String lastName,
        String phoneNumber,
        String email
) { }
