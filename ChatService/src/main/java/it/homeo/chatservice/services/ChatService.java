package it.homeo.chatservice.services;

import it.homeo.chatservice.dtos.request.CreateChatMessageDto;
import it.homeo.chatservice.models.ChatMessage;
import it.homeo.chatservice.models.ChatRoom;

import java.time.Instant;
import java.util.List;

public interface ChatService {
    List<ChatRoom> getChatRooms(String userId, Instant lastMessageCreatedAt);
    List<ChatMessage> getChatMessages(Long chatRoomId, String userId, Instant lastCreatedAt);
    ChatMessage createChatMessage(CreateChatMessageDto dto, String userId);
    ChatRoom markAsReadChatRoom(Long chatRoomId, String userId);
    List<Long> getUnreadChats(String userId);
    ChatRoom getChatRoom(String userId, Long chatRoomId);
    ChatRoom getChatRoomByParticipantsUserIds(List<String> userIds);
}
