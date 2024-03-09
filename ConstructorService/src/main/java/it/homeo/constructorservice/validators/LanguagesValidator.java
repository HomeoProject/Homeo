package it.homeo.constructorservice.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.Set;

public class LanguagesValidator implements ConstraintValidator<ValidLanguages, Set<String>>  {

    private final Set<String> languages;

    public LanguagesValidator(@Qualifier("languages") Set<String> languages) {
        this.languages = languages;
    }

    @Override
    public void initialize(ValidLanguages constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(Set<String> values, ConstraintValidatorContext context) {
        if (values == null || values.isEmpty()) {
            return false;
        }
        return languages.containsAll(values);
    }
}
