package it.homeo.reviewservice.mappers;

import it.homeo.reviewservice.dtos.response.ReviewStatsDto;
import it.homeo.reviewservice.models.ReviewStats;
import org.springframework.stereotype.Component;

@Component
public class ReviewStatsMapper {
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
}
