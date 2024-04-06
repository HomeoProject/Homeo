package it.homeo.searchservice.dtos.request;

import java.time.LocalDateTime;

public record CategoryDto(
        Long id,
        String name,
        String description,
        String image,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) { }
