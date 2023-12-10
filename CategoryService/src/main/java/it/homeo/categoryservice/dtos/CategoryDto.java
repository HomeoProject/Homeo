package it.homeo.categoryservice.dtos;

import lombok.Builder;

@Builder
public record CategoryDto(
        Long id,
        String name
) { }
