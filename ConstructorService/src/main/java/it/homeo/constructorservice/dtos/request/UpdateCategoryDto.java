package it.homeo.constructorservice.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCategoryDto(
        @NotBlank
        @Size(max = 50)
        String name,

        @NotBlank
        @Size(max = 255)
        String description
) { }
