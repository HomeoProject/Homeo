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

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.chatParticipants cp WHERE :userId IN (SELECT cp.userId FROM ChatParticipant cp) AND cr.lastMessageCreatedAt < :lastCreatedAt")
    List<ChatRoom> findChatRoomsByParticipantUserId(@Param("userId") String userId, @Param("lastCreatedAt") Instant lastCreatedAt, Pageable pageable);

    @Query("SELECT cr.id FROM ChatRoom cr JOIN cr.chatParticipants cp WHERE cp.userId = :userId AND cp.lastViewedAt < cr.lastMessageCreatedAt")
    List<Long> getUnreadChatRoomIdsByUserId(@Param("userId") String userId);

    @Query("SELECT DISTINCT cr FROM ChatRoom cr JOIN cr.chatParticipants cp WHERE cp.userId IN :userIds GROUP BY cr HAVING COUNT(DISTINCT cp) = :userCount")
    List<ChatRoom> findChatRoomsByChatParticipantsUserIds(@Param("userIds") List<String> userIds, @Param("userCount") int userCount);
}
