package it.homeo.reviewservice.dtos.response;

import lombok.Builder;

import java.util.List;

@Builder
public record ReviewPageDto(
    ReviewStatsDto stats,
    List<ReviewDto> content
) { }
