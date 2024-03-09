package it.homeo.constructorservice.dtos.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record CategoryDto(
    Long id,
    String name,
    String description,
    String image,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) { }
