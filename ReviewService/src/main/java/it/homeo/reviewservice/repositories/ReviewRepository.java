package it.homeo.reviewservice.repositories;

import it.homeo.reviewservice.models.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByReceiverIdAndReviewerId(String receiverId, String reviewerId);
    void deleteAllByReceiverId(String receiverId);
    List<Review> findByReviewerIdAndCreatedAtBeforeOrderByCreatedAtDesc(String userId, Instant lastCreatedAt, Pageable pageable);
    List<Review> findByReceiverIdAndCreatedAtBeforeOrderByCreatedAtDesc(String userId, Instant lastCreatedAt, Pageable pageable);
}
