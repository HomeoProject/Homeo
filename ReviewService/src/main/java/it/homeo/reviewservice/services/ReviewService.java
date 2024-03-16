package it.homeo.reviewservice.services;

import com.auth0.exception.Auth0Exception;
import it.homeo.reviewservice.dtos.response.ReviewPageDto;
import it.homeo.reviewservice.models.Review;
import it.homeo.reviewservice.models.ReviewStats;

import java.time.LocalDateTime;

public interface ReviewService {
    ReviewPageDto getUserReviews(String userId, LocalDateTime lastCreatedAt);
    Review getReview(Long id);
    Review addReview(Review review) throws Auth0Exception;
    Review updateReview(Long id, Review newReview);
    void deleteReview(Long id);
    void deleteAllReviewsWithReceiverId(String receiverId);
    ReviewStats getUserReviewStats(String userId);
}
