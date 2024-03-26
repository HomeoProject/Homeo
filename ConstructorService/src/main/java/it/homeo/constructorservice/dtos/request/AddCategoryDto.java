package it.homeo.constructorservice.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddCategoryDto(
        @NotBlank(message = "Name cannot be empty")
        @Size(max = 50, message = "Name cannot exceed 50 characters")
        String name,

        @NotBlank(message = "Description cannot be empty")
        @Size(max = 255, message = "Description cannot exceed 255 characters")
        String description
) { }
