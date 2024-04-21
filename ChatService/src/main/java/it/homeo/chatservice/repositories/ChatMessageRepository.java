package it.homeo.chatservice.repositories;

import it.homeo.chatservice.models.ChatMessage;
import it.homeo.chatservice.models.ChatRoom;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomAndCreatedAtBeforeOrderByCreatedAtDesc(ChatRoom chatRoom, Instant lastCreatedAt, Pageable pageable);
}
