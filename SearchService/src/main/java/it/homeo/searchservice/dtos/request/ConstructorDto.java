package it.homeo.searchservice.dtos.request;

import it.homeo.searchservice.enums.PaymentMethod;

import java.time.LocalDateTime;
import java.util.Set;

public record ConstructorDto(
        Long id,
        String userId,
        String aboutMe,
        String experience,
        Integer minRate,
        String phoneNumber,
        String constructorEmail,
        Set<String> languages,
        Set<String> cities,
        Set<CategoryDto> categories,
        Set<PaymentMethod> paymentMethods,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) { }
