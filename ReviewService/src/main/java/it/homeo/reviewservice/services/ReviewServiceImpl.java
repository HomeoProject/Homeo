package it.homeo.reviewservice.services;

import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.client.mgmt.filter.PageFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.permissions.Permission;
import it.homeo.reviewservice.dtos.response.ReviewPageDto;
import it.homeo.reviewservice.exceptions.AlreadyExistsException;
import it.homeo.reviewservice.exceptions.BadRequestException;
import it.homeo.reviewservice.exceptions.NotFoundException;
import it.homeo.reviewservice.messaging.ReviewEventProducer;
import it.homeo.reviewservice.models.Review;
import it.homeo.reviewservice.models.ReviewStats;
import it.homeo.reviewservice.repositories.ReviewRepository;
import it.homeo.reviewservice.repositories.ReviewStatsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewStatsRepository reviewStatsRepository;
    private final ReviewEventProducer reviewEventProducer;
    private final ManagementAPI mgmt;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ReviewStatsRepository reviewStatsRepository, ReviewEventProducer reviewEventProducer, ManagementAPI mgmt) {
        this.reviewRepository = reviewRepository;
        this.reviewStatsRepository = reviewStatsRepository;
        this.reviewEventProducer = reviewEventProducer;
        this.mgmt = mgmt;
    }

    @Override
    public ReviewPageDto getUserReviews(String userId, LocalDateTime lastCreatedAt) {
        Optional<ReviewPageDto> reviewPageDto = reviewRepository.findReviewPageBeforeCreatedAt(userId, lastCreatedAt);

        return reviewPageDto.orElseGet(() -> ReviewPageDto.builder()
                .reviewsNumber(0)
                .content(new ArrayList<>())
                .build());
    }

    @Override
    public Review getReview(Long id) {
        return reviewRepository.findById(id).orElseThrow(() -> new NotFoundException(id, "Review"));
    }

    @Transactional
    @Override
    public Review addReview(Review review) throws Auth0Exception {
        validateAddReview(review);
        Review newReview = reviewRepository.save(review);
        Optional<ReviewStats> reviewStats = reviewStatsRepository.findByUserId(review.getReceiverId());

        if (reviewStats.isEmpty()) {
            ReviewStats newReviewStats = new ReviewStats();
            newReviewStats.setReviewsNumber(1);
            newReviewStats.setRatingsSum(newReview.getRating());
            newReviewStats.setUserId(newReview.getReceiverId());
            newReviewStats = reviewStatsRepository.save(newReviewStats);
            reviewEventProducer.produceAvgReviewUpdated(newReviewStats);
            return newReview;
        }

        ReviewStats oldReviewStats = reviewStats.get();
        Integer newReviewsNumber = oldReviewStats.getReviewsNumber() + 1;
        Double newRatingsSum = oldReviewStats.getRatingsSum() + newReview.getRating();
        oldReviewStats.setReviewsNumber(newReviewsNumber);
        oldReviewStats.setRatingsSum(newRatingsSum);
        oldReviewStats = reviewStatsRepository.save(oldReviewStats);
        reviewEventProducer.produceAvgReviewUpdated(oldReviewStats);
        return newReview;
    }

    @Override
    public Review updateReview(Long id, Review newReview) {
        return null;
    }

    @Transactional
    @Override
    public void deleteReview(Long id) {
        Review review = getReview(id);
        ReviewStats reviewStats = getUserReviewStats(review.getReceiverId());
        Integer newReviewsNumber = reviewStats.getReviewsNumber() - 1;
        Double newRatingsSum = reviewStats.getRatingsSum() - review.getRating();
        reviewStats.setReviewsNumber(newReviewsNumber);
        reviewStats.setRatingsSum(newRatingsSum);
        reviewStatsRepository.save(reviewStats);
        reviewRepository.delete(review);
    }

    @Transactional
    @Override
    public void deleteAllReviewsWithReceiverId(String receiverId) {
        reviewRepository.deleteAllByReceiverId(receiverId);
        reviewStatsRepository.deleteByUserId(receiverId);
    }

    @Override
    public ReviewStats getUserReviewStats(String userId) {
        return reviewStatsRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException("ReviewStats with userId: " + userId + " not found"));
    }

    private void validateAddReview(Review review) throws Auth0Exception {
        if (reviewRepository.findByReceiverIdAndReviewerId(review.getReceiverId(), review.getReviewerId()).isPresent()) {
            throw new AlreadyExistsException("User with id: " + review.getReviewerId() + " already gave review to user with id: " + review.getReceiverId());
        }
        if (isUserHasNotConstructorPermission(review.getReceiverId())) {
            throw new BadRequestException("Receiver with id: " + review.getReceiverId() + " is not a constructor");
        }
    }

    private boolean isUserHasNotConstructorPermission(String userId) throws Auth0Exception {
        List<Permission> auth0UserPermissions = mgmt.users()
                .listPermissions(userId, new PageFilter())
                .execute()
                .getBody()
                .getItems();

        Set<String> userPermissions = auth0UserPermissions.stream()
                .map(Permission::getName)
                .collect(Collectors.toSet());

        return !userPermissions.contains("constructor:permission");
    }
}
