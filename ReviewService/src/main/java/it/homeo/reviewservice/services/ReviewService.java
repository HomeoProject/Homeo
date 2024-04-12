package it.homeo.reviewservice.services;

import com.auth0.exception.Auth0Exception;
import it.homeo.reviewservice.dtos.response.ReviewPageDto;
import it.homeo.reviewservice.models.Review;
import it.homeo.reviewservice.models.ReviewStats;

import java.time.Instant;
import java.util.List;

public interface ReviewService {
    ReviewPageDto getUserReceivedReviews(String userId, Instant lastCreatedAt);
    List<Review> getUserReviewedReviews(String userId, Instant lastCreatedAt);
    Review getReview(Long id);
    Review addReview(Review review) throws Auth0Exception;
    Review updateReview(Long id, String userId, Review newReview);
    void deleteReview(Long id, String userId);
    void deleteAllReviewsWithReceiverId(String receiverId);
    ReviewStats getUserReviewStats(String userId);
}
