package it.homeo.reviewservice.dtos.response;

import lombok.Builder;

import java.time.Instant;

@Builder
public record ReviewDto(
        Long id,
        String reviewerId,
        String receiverId,
        Double rating,
        String text,
        Instant createdAt,
        Instant updatedAt
) { }
