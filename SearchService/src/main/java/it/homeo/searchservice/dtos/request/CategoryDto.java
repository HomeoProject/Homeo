package it.homeo.searchservice.dtos.request;

import java.time.Instant;

public record CategoryDto(
        Long id,
        String name,
        String description,
        String image,
        Instant createdAt,
        Instant updatedAt
) { }
