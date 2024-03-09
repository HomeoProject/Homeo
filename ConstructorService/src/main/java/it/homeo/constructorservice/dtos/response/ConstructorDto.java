package it.homeo.constructorservice.dtos.response;

import it.homeo.constructorservice.enums.PaymentMethod;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Set;

@Builder
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
