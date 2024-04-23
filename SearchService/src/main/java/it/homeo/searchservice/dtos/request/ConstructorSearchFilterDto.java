package it.homeo.searchservice.dtos.request;

import it.homeo.searchservice.enums.PaymentMethod;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConstructorSearchFilterDto {

    private String generalSearchQuery;

    @Size(min = 1, message = "CategoryIds must not be empty")
    private Set<Long> categoryIds;

    @Min(value = 0, message = "MinMinRate must be greater than or equal to 0")
    private Integer minMinRate;

    @Min(value = 0, message = "MaxMinRate must be greater than or equal to 0")
    private Integer maxMinRate;

    @Min(value = 0, message = "MinAverageRating must be greater than or equal to 0")
    private Double minAverageRating;

    @Min(value = 0, message = "MaxAverageRating must be greater than or equal to 0")
    private Double maxAverageRating;

    @Min(value = 0, message = "ExactAverageRating must be greater than or equal to 0")
    private Double exactAverageRating;

    private Boolean isApproved;

    @Size(min = 1, message = "Languages must not be empty")
    private Set<String> languages;

    @Size(min = 1, message = "PaymentMethods must not be empty")
    private Set<PaymentMethod> paymentMethods;

    @Size(min = 1, message = "Cities must not be empty")
    private Set<String> cities;

    @AssertTrue(message = "MaxMinRate must be greater than minMinRate")
    private boolean isValidRateRange() {
        if (maxMinRate != null && minMinRate != null) {
            return maxMinRate >= minMinRate;
        }
        return true;
    }

    @AssertTrue(message = "MaxAverageRating must be greater than minAverageRating")
    private boolean isValidRatingRange() {
        if (maxAverageRating != null && minAverageRating != null) {
            return maxAverageRating >= minAverageRating;
        }
        return true;
    }

    @AssertTrue(message = "If ExactAverageRating is specified, MinAverageRating and MaxAverageRating should not be specified")
    private boolean isValidExactRating() {
        if (exactAverageRating != null) {
            return minAverageRating == null && maxAverageRating == null;
        }
        return true;
    }
}
