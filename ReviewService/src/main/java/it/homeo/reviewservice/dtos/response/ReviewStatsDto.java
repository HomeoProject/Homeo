package it.homeo.reviewservice.dtos.response;

import lombok.Builder;

@Builder
public record ReviewStatsDto(
        String userId,
        Double averageRating,
        Integer reviewsNumber
) { }
