package it.homeo.chatservice.services;

import it.homeo.chatservice.clients.UserClient;
import it.homeo.chatservice.dtos.request.CreateChatMessageDto;
import it.homeo.chatservice.dtos.response.CloudinaryDto;
import it.homeo.chatservice.exceptions.BadRequestException;
import it.homeo.chatservice.exceptions.ForbiddenException;
import it.homeo.chatservice.exceptions.NotFoundException;
import it.homeo.chatservice.models.ChatMessage;
import it.homeo.chatservice.models.ChatParticipant;
import it.homeo.chatservice.models.ChatRoom;
import it.homeo.chatservice.repositories.ChatMessageRepository;
import it.homeo.chatservice.repositories.ChatParticipantRepository;
import it.homeo.chatservice.repositories.ChatRoomRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class ChatServiceImpl implements ChatService {

    private final CloudinaryService cloudinaryService;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserClient userClient;

    public ChatServiceImpl(
            CloudinaryService cloudinaryService,
            ChatRoomRepository chatRoomRepository,
            ChatParticipantRepository chatParticipantRepository,
            ChatMessageRepository chatMessageRepository,
            UserClient userClient
    ) {
        this.cloudinaryService = cloudinaryService;
        this.chatRoomRepository = chatRoomRepository;
        this.chatParticipantRepository = chatParticipantRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userClient = userClient;
    }

    @Override
    public List<ChatRoom> getChatRooms(String userId, Instant lastMessageCreatedAt) {
        Sort sort = Sort.by(Sort.Direction.DESC, "lastMessageCreatedAt");
        Pageable pageable = PageRequest.of(0, 20, sort);
        return chatRoomRepository.findChatRoomsByParticipantUserId(userId, lastMessageCreatedAt, pageable);
    }

    @Override
    public List<ChatMessage> getChatMessages(Long chatRoomId, String userId, Instant lastCreatedAt) {
        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findById(chatRoomId);

        if (optionalChatRoom.isEmpty()) {
            return new ArrayList<>();
        }

        ChatRoom chatRoom = optionalChatRoom.get();

        boolean participantExists = doesParticipantExist(chatRoom, userId);
        if (!participantExists) {
            throw new ForbiddenException();
        }

        Pageable pageable = PageRequest.of(0, 20);

        return chatMessageRepository.findByChatRoomAndCreatedAtBeforeOrderByCreatedAtDesc(chatRoom, lastCreatedAt, pageable);
    }

    @Override
    @Transactional
    public ChatMessage createChatMessage(CreateChatMessageDto dto, String userId) {
        if (dto.chatRoomId() == null) {
            return createFirstChatMessage(dto, userId);
        }

        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findById(dto.chatRoomId());

        if (optionalChatRoom.isEmpty()) {
            throw new NotFoundException("Chat room with id: " + dto.chatRoomId() + " not found");
        }

        ChatRoom chatRoom = optionalChatRoom.get();

        Optional<ChatParticipant> optionalChatParticipant = getChatParticipant(chatRoom, userId);
        if (optionalChatParticipant.isEmpty()) {
            throw new ForbiddenException();
        }

        Instant now = Instant.now();
        ChatParticipant chatParticipant = optionalChatParticipant.get();
        chatParticipant.setLastViewedAt(now);
        chatParticipantRepository.save(chatParticipant);

        ChatMessage chatMessage = setChatMessage(dto, chatRoom, userId, now);
        chatMessageRepository.save(chatMessage);

        chatRoom.setLastMessageCreatedAt(now);
        chatRoomRepository.save(chatRoom);

        return chatMessage;
    }

    @Override
    public ChatRoom markAsReadChatRoom(Long chatRoomId, String userId) {
        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findById(chatRoomId);
        if (optionalChatRoom.isEmpty()) {
            return null;
        }

        ChatRoom chatRoom = optionalChatRoom.get();

        Optional<ChatParticipant> optionalChatParticipant = getChatParticipant(chatRoom, userId);
        if (optionalChatParticipant.isEmpty()) {
            throw new ForbiddenException();
        }

        ChatParticipant chatParticipant = optionalChatParticipant.get();
        chatParticipant.setLastViewedAt(Instant.now());
        chatParticipantRepository.save(chatParticipant);

        return chatRoom;
    }

    @Override
    public List<Long> getUnreadChats(String userId) {
        return chatRoomRepository.getUnreadChatRoomIdsByUserId(userId);
    }

    @Override
    public ChatRoom getChatRoom(String userId, Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new NotFoundException("ChatRoom with id: " + chatRoomId + " not found."));

        boolean participantExists = doesParticipantExist(chatRoom, userId);
        if (!participantExists) {
            throw new ForbiddenException();
        }

        return chatRoom;
    }

    @Override
    public ChatRoom getChatRoomByParticipantsUserIds(List<String> userIds) {
        if (userIds.size() < 2) {
            throw new BadRequestException("At least two user IDs are required to check the existence of a chat room.");
        }
        List<ChatRoom> chatRooms = chatRoomRepository.findChatRoomsByChatParticipantsUserIds(userIds, userIds.size());
        return chatRooms.stream().findFirst().orElse(null);
    }

    private boolean doesParticipantExist(ChatRoom chatRoom, String userId) {
        return chatRoom.getChatParticipants().stream()
                .anyMatch(participant -> participant.getUserId().equals(userId));
    }

    private Optional<ChatParticipant> getChatParticipant(ChatRoom chatRoom, String userId) {
        return chatRoom.getChatParticipants().stream()
                .filter(chatParticipant -> chatParticipant.getUserId().equals(userId))
                .findFirst();
    }

    private ChatMessage createFirstChatMessage(CreateChatMessageDto dto, String userId) {
        validateChatRoomExistenceWithParticipants(dto, userId);

        Set<ChatParticipant> chatParticipantSet = new HashSet<>();
        for (String participantId : dto.chatParticipantsIds()) {
            if (!participantId.equals(userId)) {
                userClient.getAppUserById(participantId);
                ChatParticipant chatParticipant = new ChatParticipant();
                chatParticipant.setUserId(participantId);
                chatParticipantSet.add(chatParticipant);
            }
        }
        Instant now = Instant.now();
        ChatParticipant chatParticipant = new ChatParticipant();
        chatParticipant.setUserId(userId);
        chatParticipant.setLastViewedAt(now);
        chatParticipantSet.add(chatParticipant);

        List<ChatParticipant> savedParticipants = chatParticipantRepository.saveAll(chatParticipantSet);

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatParticipants(new HashSet<>(savedParticipants));
        chatRoom = chatRoomRepository.save(chatRoom);

        ChatMessage chatMessage = setChatMessage(dto, chatRoom, userId, now);
        chatMessage = chatMessageRepository.save(chatMessage);

        chatRoom.setLastMessageCreatedAt(chatMessage.getCreatedAt());
        chatRoomRepository.save(chatRoom);

        return chatMessage;
    }

    private ChatMessage setChatMessage(CreateChatMessageDto dto, ChatRoom chatRoom, String senderId, Instant chatMessageCreatedAt) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setSenderId(senderId);
        chatMessage.setContent(dto.content());
        chatMessage.setCreatedAt(chatMessageCreatedAt);

        if (dto.image() != null && dto.image().length > 0) {
            CloudinaryDto cloudinaryDto = cloudinaryService.uploadFile(dto.image());
            chatMessage.setImageUrl(cloudinaryDto.imageUrl());
        }

        return chatMessage;
    }

    private void validateChatRoomExistenceWithParticipants(CreateChatMessageDto dto, String userId){
        Set<String> participantsIds = dto.chatParticipantsIds();
        participantsIds.add(userId);
        List<String> participantsList = new ArrayList<>(participantsIds);
        ChatRoom existingChatRoom = getChatRoomByParticipantsUserIds(participantsList);
        if (existingChatRoom != null) {
            throw new BadRequestException("Chat room with these participants already exists.");
        }
    }
}
