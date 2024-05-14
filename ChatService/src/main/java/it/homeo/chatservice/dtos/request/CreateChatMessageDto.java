package it.homeo.chatservice.dtos.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import it.homeo.chatservice.converters.ByteArrayDeserializer;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record CreateChatMessageDto(
        String content,

        Long chatRoomId,

        @JsonDeserialize(using = ByteArrayDeserializer.class)
        byte[] image,

        @Size(min = 2)
        Set<String> chatParticipantsIds
) { }
