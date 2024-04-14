package it.homeo.chatservice.dtos.response;

import java.time.Instant;

public record ChatMessageDto(
        Long id,
        Long chatRoomId,
        String senderId,
        String content,
        String imageUrl,
        Instant createdAt
) { }
