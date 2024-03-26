package it.homeo.constructorservice.dtos.request;

import it.homeo.constructorservice.enums.PaymentMethod;
import it.homeo.constructorservice.validators.ValidCities;
import it.homeo.constructorservice.validators.ValidLanguages;
import it.homeo.constructorservice.validators.ValidPaymentMethods;
import jakarta.validation.constraints.*;

import java.util.Set;

public record UpdateConstructorDto(
        @NotBlank(message = "About me cannot be empty")
        String aboutMe,

        @NotBlank(message = "Experience cannot be empty")
        String experience,

        @Min(value = 1, message = "Minimum rate must be at least 1")
        Integer minRate,

        @NotBlank(message = "Phone number cannot be empty")
        @Pattern(regexp = "^(?:\\+48)?\\d{9}$", message = "Invalid phone number format")
        String phoneNumber,

        @NotBlank(message = "Constructor email cannot be empty")
        @Email(message = "Invalid email format")
        String constructorEmail,

        @ValidLanguages
        @Size(min = 1, max = 6, message = "Languages must be between 1 and 6")
        Set<String> languages,

        @ValidCities
        @Size(min = 1, max = 6, message = "Cities must be between 1 and 6")
        Set<String> cities,

        @Size(min = 1, max = 10, message = "Category IDs must be between 1 and 10")
        Set<Long> categoryIds,

        @ValidPaymentMethods
        @NotEmpty(message = "Payment methods cannot be empty")
        Set<PaymentMethod> paymentMethods
) { }
