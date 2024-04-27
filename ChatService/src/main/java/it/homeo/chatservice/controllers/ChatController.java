package it.homeo.chatservice.controllers;

import it.homeo.chatservice.dtos.response.ChatMessageDto;
import it.homeo.chatservice.mappers.ChatMapper;
import it.homeo.chatservice.models.ChatMessage;
import it.homeo.chatservice.models.ChatRoom;
import it.homeo.chatservice.services.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatController.class);
    private final ChatService chatService;
    private final ChatMapper chatMapper;

    public ChatController(ChatService chatService, ChatMapper chatMapper) {
        this.chatService = chatService;
        this.chatMapper = chatMapper;
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getChatRooms(@RequestParam("lastMessageCreatedAt") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant lastMessageCreatedAt) {
        LOGGER.info("Inside: ChatController -> getChatRooms()...");
        String userId = getUserId();
        return ResponseEntity.ok(chatService.getChatRooms(userId, lastMessageCreatedAt));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<ChatMessageDto>> getChatMessages(@PathVariable Long id, @RequestParam("lastCreatedAt") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant lastCreatedAt) {
        LOGGER.info("Inside: ChatController -> getChatMessages()...");
        String userId = getUserId();
        List<ChatMessage> chatMessages = chatService.getChatMessages(id, userId, lastCreatedAt);
        return ResponseEntity.ok(chatMessages.stream().map(chatMapper::toDto).toList());
    }

    @GetMapping("/unread-chats")
    public ResponseEntity<List<Long>> getUnreadChats() {
        LOGGER.info("Inside: ChatController -> getUnreadChats()...");
        String userId = getUserId();
        return ResponseEntity.ok(chatService.getUnreadChats(userId));
    }

    @GetMapping("/room/{id}")
    public ResponseEntity<ChatRoom> getChatRoom(@PathVariable Long id) {
        LOGGER.info("Inside: ChatController -> getChatRoom()...");
        String userId = getUserId();
        return ResponseEntity.ok(chatService.getChatRoom(userId, id));
    }

    @GetMapping("/room/exists")
    public ResponseEntity<Boolean> doesChatRoomExist(@RequestParam("userIds") List<String> userIds) {
        LOGGER.info("Inside: ChatController -> doesChatRoomExist()...");
        boolean chatRoomExists = chatService.doesChatRoomExist(userIds);
        return ResponseEntity.ok(chatRoomExists);
    }

    private String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
