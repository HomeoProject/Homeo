package it.homeo.userservice.dtos.request;

public record UserIsOnlineEventDto(
        String userId,
        Boolean isOnline
) { }
