package it.homeo.searchservice.dtos.request;

import lombok.Builder;

@Builder
public record ReviewStatsDto(
        String userId,
        Double averageRating,
        Integer reviewsNumber
) { }
