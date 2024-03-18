package it.homeo.reviewservice.dtos.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateReviewDto(
        @NotBlank
        String text,

        @Min(1)
        @Max(5)
        @NotNull
        Double rating
) { }
