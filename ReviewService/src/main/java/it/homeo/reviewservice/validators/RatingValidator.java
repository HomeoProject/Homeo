package it.homeo.reviewservice.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RatingValidator implements ConstraintValidator<ValidRating, Double> {

    @Override
    public void initialize(ValidRating constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(Double rating, ConstraintValidatorContext context) {
        if (rating == null) {
            return false;
        }

        return rating >= 0.5 && rating <= 5 && rating % 0.5 == 0;
    }
}
