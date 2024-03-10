package it.homeo.constructorservice.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = LanguagesValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidLanguages {
    String message() default "Invalid language";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
