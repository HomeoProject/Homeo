package it.homeo.reviewservice.controllers;

import com.auth0.exception.Auth0Exception;
import it.homeo.reviewservice.dtos.request.AddReviewDto;
import it.homeo.reviewservice.dtos.request.UpdateReviewDto;
import it.homeo.reviewservice.dtos.response.ReviewDto;
import it.homeo.reviewservice.dtos.response.ReviewPageDto;
import it.homeo.reviewservice.dtos.response.ReviewStatsDto;
import it.homeo.reviewservice.mappers.ReviewMapper;
import it.homeo.reviewservice.models.Review;
import it.homeo.reviewservice.models.ReviewStats;
import it.homeo.reviewservice.services.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReviewController.class);
    private final ReviewMapper reviewMapper;
    private final ReviewService reviewService;

    public ReviewController(ReviewMapper reviewMapper, ReviewService reviewService) {
        this.reviewMapper = reviewMapper;
        this.reviewService = reviewService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDto> getReview(@PathVariable Long id) {
        LOGGER.info("Inside: ReviewController -> getReview()...");
        Review review = reviewService.getReview(id);
        return ResponseEntity.ok(reviewMapper.toDto(review));
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<ReviewStatsDto> getUserReviewStats(@PathVariable String userId) {
        LOGGER.info("Inside: ReviewController -> getUserReviewStats()...");
        ReviewStats reviewStats = reviewService.getUserReviewStats(userId);
        return ResponseEntity.ok(reviewMapper.toDto(reviewStats));
    }

    @GetMapping("/received/{userId}")
    public ResponseEntity<ReviewPageDto> getUserReceivedReviews(@PathVariable String userId, @RequestParam("lastCreatedAt") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime lastCreatedAt) {
        LOGGER.info("Inside: ReviewController -> getUserReceivedReviews()...");
        return ResponseEntity.ok(reviewService.getUserReceivedReviews(userId, lastCreatedAt));
    }

    @GetMapping("/user/reviewed")
    public ResponseEntity<List<ReviewDto>> getUserReviewedReviews(@RequestParam("lastCreatedAt") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime lastCreatedAt) {
        LOGGER.info("Inside: ReviewController -> getUserReviewedReviews()...");
        String userId = getUserId();
        List<Review> reviews = reviewService.getUserReviewedReviews(userId, lastCreatedAt);
        return ResponseEntity.ok(reviews.stream().map(reviewMapper::toDto).toList());
    }

    @PostMapping
    public ResponseEntity<ReviewDto> addReview(@RequestBody @Valid AddReviewDto dto, HttpServletRequest request) throws Auth0Exception {
        LOGGER.info("Inside: ReviewController -> addReview()...");
        String userId = getUserId();
        Review review = reviewMapper.toEntity(dto, userId);
        review = reviewService.addReview(review);
        URI location = ServletUriComponentsBuilder
                .fromRequest(request)
                .path("/{id}")
                .buildAndExpand(review.getId())
                .toUri();
        return ResponseEntity.created(location).body(reviewMapper.toDto(review));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewDto> updateReview(@RequestBody @Valid UpdateReviewDto dto, @PathVariable Long id) {
        LOGGER.info("Inside: ReviewController -> updateReview()...");
        String userId = getUserId();
        Review newReview = reviewMapper.toEntity(dto);
        newReview = reviewService.updateReview(id, userId, newReview);
        return ResponseEntity.ok(reviewMapper.toDto(newReview));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        LOGGER.info("Inside: ReviewController -> deleteReview()...");
        String userId = getUserId();
        reviewService.deleteReview(id, userId);
        return ResponseEntity.noContent().build();
    }

    private String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
