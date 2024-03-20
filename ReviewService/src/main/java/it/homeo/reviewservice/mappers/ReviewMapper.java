package it.homeo.reviewservice.mappers;

import it.homeo.reviewservice.dtos.request.AddReviewDto;
import it.homeo.reviewservice.dtos.request.UpdateReviewDto;
import it.homeo.reviewservice.dtos.response.ReviewDto;
import it.homeo.reviewservice.dtos.response.ReviewStatsDto;
import it.homeo.reviewservice.models.Review;
import it.homeo.reviewservice.models.ReviewStats;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {
    public ReviewDto toDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .receiverId(review.getReceiverId())
                .reviewerId(review.getReviewerId())
                .rating(review.getRating())
                .text(review.getText())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }

    public ReviewStatsDto toDto(ReviewStats reviewStats) {
        double averageRating = reviewStats.getReviewsNumber() > 0 ?
                reviewStats.getRatingsSum() / reviewStats.getReviewsNumber() :
                0.0;

        return ReviewStatsDto.builder()
                .userId(reviewStats.getUserId())
                .averageRating(averageRating)
                .reviewsNumber(reviewStats.getReviewsNumber())
                .build();
    }

    public Review toEntity(AddReviewDto dto, String userId) {
        Review review = new Review();
        review.setText(dto.text());
        review.setReviewerId(userId);
        review.setReceiverId(dto.receiverId());
        review.setRating(dto.rating());
        return review;
    }

    public Review toEntity(UpdateReviewDto dto) {
        Review review = new Review();
        review.setText(dto.text());
        review.setRating(dto.rating());
        return review;
    }
}
