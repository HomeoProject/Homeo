package it.homeo.chatservice.controllers;

import it.homeo.chatservice.converters.JsonToCreateChatMessageDtoConverter;
import it.homeo.chatservice.dtos.request.CreateChatMessageDto;
import it.homeo.chatservice.exceptions.BadRequestException;
import it.homeo.chatservice.models.ChatMessage;
import it.homeo.chatservice.models.ChatParticipant;
import it.homeo.chatservice.models.ChatRoom;
import it.homeo.chatservice.services.ChatService;
import it.homeo.chatservice.validators.CreateChatMessageDtoValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketController {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketController.class);
    private final JsonToCreateChatMessageDtoConverter jsonToCreateChatMessageDtoConverter;
    private final ChatService chatService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public WebSocketController(JsonToCreateChatMessageDtoConverter jsonToCreateChatMessageDtoConverter, ChatService chatService, SimpMessagingTemplate simpMessagingTemplate) {
        this.jsonToCreateChatMessageDtoConverter = jsonToCreateChatMessageDtoConverter;
        this.chatService = chatService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/message")
    public void createMessage(@Payload String json, Principal principal) {
        LOGGER.info("Inside: WebSocketController -> createMessage()...");
        CreateChatMessageDto createChatMessageDto = jsonToCreateChatMessageDtoConverter.convert(json);
        if (!CreateChatMessageDtoValidator.isValid(createChatMessageDto)) {
            throw new BadRequestException("Invalid CreateChatMessageDto");
        }
        String userId = principal.getName();
        ChatMessage chatMessage = chatService.createChatMessage(createChatMessageDto, userId);
        for (ChatParticipant chatParticipant : chatMessage.getChatRoom().getChatParticipants()) {
            if (!chatParticipant.getUserId().equals(userId)) {
                simpMessagingTemplate.convertAndSendToUser(chatParticipant.getUserId(), "/queue/chat-notification", chatMessage);
            }
        }
    }

    @MessageMapping("/mark-as-read/{roomId}")
    public void markAsReadChatRoom(@DestinationVariable Long roomId, Principal principal) {
        LOGGER.info("Inside: WebSocketController -> markAsReadChatRoom()...");
        String userId = principal.getName();
        ChatRoom chatRoom = chatService.markAsReadChatRoom(roomId, userId);
        for (ChatParticipant chatParticipant : chatRoom.getChatParticipants()) {
            if (!chatParticipant.getUserId().equals(userId)) {
                String roomQueue = "/queue/" + roomId;
                simpMessagingTemplate.convertAndSendToUser(chatParticipant.getUserId(), roomQueue, chatRoom);
            }
        }
    }
}
