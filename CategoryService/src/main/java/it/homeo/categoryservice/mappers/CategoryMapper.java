package it.homeo.categoryservice.mappers;

import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.models.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "id", source = "id")
    CategoryDto categoryToCategoryDto(Category category);
}
