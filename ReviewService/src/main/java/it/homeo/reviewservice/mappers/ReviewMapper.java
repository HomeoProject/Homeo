package it.homeo.reviewservice.mappers;

import it.homeo.reviewservice.dtos.response.ReviewDto;
import it.homeo.reviewservice.models.Review;
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
}
