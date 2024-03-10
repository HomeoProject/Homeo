package it.homeo.constructorservice.dtos.request;

import it.homeo.constructorservice.enums.PaymentMethod;
import it.homeo.constructorservice.validators.ValidLanguages;
import it.homeo.constructorservice.validators.ValidPaymentMethods;
import jakarta.validation.constraints.*;

import java.util.Set;

public record UpdateConstructorDto(
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
        Set<String> languages,

        // TODO add validator to check if every city is in GCP
        @NotEmpty
        Set<String> cities,

        Set<Long> categoryIds,

        @ValidPaymentMethods
        Set<PaymentMethod> paymentMethods
) { }
