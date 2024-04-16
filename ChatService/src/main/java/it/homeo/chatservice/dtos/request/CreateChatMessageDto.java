package it.homeo.chatservice.dtos.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record CreateChatMessageDto(
        String content,
        byte[] image,

        @NotNull
        Long chatRoomId,

        @Size(min = 2)
        Set<String> chatParticipantsIds
) { }