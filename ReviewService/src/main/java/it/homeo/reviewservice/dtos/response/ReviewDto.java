package it.homeo.reviewservice.dtos.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ReviewDto(
        Long id,
        String reviewerId,
        String receiverId,
        Double rating,
        String text,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) { }
