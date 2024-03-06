package it.homeo.constructorservice.mappers;

import it.homeo.constructorservice.dtos.request.AddCategoryDto;
import it.homeo.constructorservice.dtos.response.CategoryDto;
import it.homeo.constructorservice.models.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDto toDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .image(category.getImage())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    public Category toEntity(AddCategoryDto dto) {
        Category category = new Category();
        category.setName(dto.name());
        category.setDescription(dto.description());
        return category;
    }
}
