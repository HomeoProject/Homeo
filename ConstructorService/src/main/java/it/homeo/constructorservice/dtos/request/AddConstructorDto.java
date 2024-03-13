package it.homeo.constructorservice.dtos.request;

import it.homeo.constructorservice.enums.PaymentMethod;
import it.homeo.constructorservice.validators.ValidCities;
import it.homeo.constructorservice.validators.ValidLanguages;
import it.homeo.constructorservice.validators.ValidPaymentMethods;
import jakarta.validation.constraints.*;

import java.util.Set;

public record AddConstructorDto(
        @NotBlank
        String aboutMe,

        @NotBlank
        String experience,

        @Min(1)
        Integer minRate,

        @NotBlank
        @Pattern(regexp = "^(?:\\+48)?\\d{9}$")
        String phoneNumber,

        @NotBlank
        @Email
        String constructorEmail,

        @ValidLanguages
        @Size(min= 1, max = 6)
        Set<String> languages,

        @ValidCities
        @Size(min= 1, max = 6)
        Set<String> cities,

        @Size(min= 1, max = 10)
        Set<Long> categoryIds,

        @ValidPaymentMethods
        @NotEmpty
        Set<PaymentMethod> paymentMethods
) { }
