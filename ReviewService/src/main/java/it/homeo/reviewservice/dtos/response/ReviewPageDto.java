package it.homeo.reviewservice.dtos.response;

import lombok.Builder;

import java.util.List;

@Builder
public record ReviewPageDto(
    Double averageRating,
    Integer reviewsNumber,
    List<ReviewDto> content
) { }
