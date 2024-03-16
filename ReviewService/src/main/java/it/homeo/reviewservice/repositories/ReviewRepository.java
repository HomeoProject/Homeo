package it.homeo.reviewservice.repositories;

import it.homeo.reviewservice.dtos.response.ReviewPageDto;
import it.homeo.reviewservice.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByReceiverIdAndReviewerId(String receiverId, String reviewerId);

    void deleteAllByReceiverId(String receiverId);

    @Query("SELECT new it.homeo.reviewservice.dtos.response.ReviewPageDto(" +
            "   COALESCE(rs.ratingsSum / rs.reviewsNumber, null), " +
            "   COALESCE(rs.reviewsNumber, 0), " +
            "   (SELECT new it.homeo.reviewservice.dtos.response.ReviewDto(" +
            "       r.id, " +
            "       r.reviewerId, " +
            "       r.receiverId, " +
            "       r.rating, " +
            "       r.text, " +
            "       r.createdAt, " +
            "       r.updatedAt) " +
            "   FROM Review r " +
            "   WHERE r.receiverId = :userId AND r.createdAt < :lastCreatedAt " +
            "   ORDER BY r.createdAt DESC" +
            "   LIMIT 5)) " +
            "FROM ReviewStats rs " +
            "WHERE rs.userId = :userId")
    Optional<ReviewPageDto> findReviewPageBeforeCreatedAt(@Param("userId") String userId, @Param("lastCreatedAt") LocalDateTime lastCreatedAt);
}
