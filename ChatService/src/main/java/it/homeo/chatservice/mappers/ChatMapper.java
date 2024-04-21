package it.homeo.chatservice.mappers;

import it.homeo.chatservice.dtos.response.ChatMessageDto;
import it.homeo.chatservice.models.ChatMessage;
import org.springframework.stereotype.Component;

@Component
public class ChatMapper {

    public ChatMessageDto toDto(ChatMessage chatMessage) {
        return new ChatMessageDto(
                chatMessage.getId(),
                chatMessage.getChatRoom().getId(),
                chatMessage.getSenderId(),
                chatMessage.getContent(),
                chatMessage.getImageUrl(),
                chatMessage.getCreatedAt()
        );
    }
}
