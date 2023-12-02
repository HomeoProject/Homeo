package it.homeo.categoryservice.mappers;

import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.models.Category;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class CategoryMapperTest {
    private final CategoryMapper mapper = Mappers.getMapper(CategoryMapper.class);

    @Test
    void shouldMapCategoryToNullCategoryDto() {
        CategoryDto dto = mapper.categoryToCategoryDto(null);
        assertThat(dto).isNull();
    }

    @Test
    void shouldMapCategoryToCategoryDto() {
        Category category = new Category(
                1L,
                "CategoryName",
                "User1",
                "User2",
                LocalDateTime.now(),
                LocalDateTime.now()
        );
        CategoryDto dto = mapper.categoryToCategoryDto(category);
        assertThat(dto).isNotNull();
        assertThat(dto.id()).isEqualTo(category.getId());
        assertThat(dto.name()).isEqualTo(category.getName());
    }
}
