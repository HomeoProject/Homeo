package it.homeo.reviewservice.dtos.response;

import lombok.Builder;

import java.time.LocalDateTime;

// I'm creating a traditional class because IntelliJ doesn't see the constructor in the JPQL query in the ReviewRepository class when it doesn't define it classically
@Builder
public class ReviewDto {
    private Long id;
    private String reviewerId;
    private String receiverId;
    private Double rating;
    private String text;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReviewDto(Long id, String reviewerId, String receiverId, Double rating, String text, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.reviewerId = reviewerId;
        this.receiverId = receiverId;
        this.rating = rating;
        this.text = text;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
