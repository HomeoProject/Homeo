package it.homeo.chatservice.repositories;

import it.homeo.chatservice.models.ChatRoom;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.chatParticipants cp WHERE :userId IN (SELECT cp.userId FROM ChatParticipant cp) AND cr.lastMessageCreatedAt > :lastCreatedAt")
    List<ChatRoom> findChatRoomsByParticipantUserId(@Param("userId") String userId, @Param("lastCreatedAt") Instant lastCreatedAt, Pageable pageable);

    @Query("SELECT cr.id FROM ChatRoom cr JOIN cr.chatParticipants cp WHERE :userId IN (SELECT cp.userId FROM ChatParticipant cp) AND cp.lastViewedAt < cr.lastMessageCreatedAt")
    List<Long> getUnreadChatRoomIdsByUserId(@Param("userId") String userId);
}
