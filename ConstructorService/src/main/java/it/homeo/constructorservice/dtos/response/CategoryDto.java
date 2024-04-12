package it.homeo.constructorservice.dtos.response;

import lombok.Builder;

import java.time.Instant;

@Builder
public record CategoryDto(
    Long id,
    String name,
    String description,
    String image,
    Instant createdAt,
    Instant updatedAt
) { }
