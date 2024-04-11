package it.homeo.chatservice.dtos.response;

public record UserIsOnlineEventDto(
        String userId,
        Boolean isOnline
) { }
