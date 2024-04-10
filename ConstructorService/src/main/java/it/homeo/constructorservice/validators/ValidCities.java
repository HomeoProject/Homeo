package it.homeo.constructorservice.validators;

import jakarta.validation.Constraint;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CitiesValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidCities {
    String message() default "Invalid city";
    Class<?>[] groups() default {};
    Class<?>[] payload() default {};
}
