package it.homeo.reviewservice.dtos.request;

import it.homeo.reviewservice.validators.ValidRating;
import jakarta.validation.constraints.NotBlank;

public record AddReviewDto(
    @NotBlank(message = "Text cannot be empty")
    String text,

    @ValidRating
    Double rating,

    @NotBlank(message = "Receiver ID cannot be empty")
    String receiverId
) { }
