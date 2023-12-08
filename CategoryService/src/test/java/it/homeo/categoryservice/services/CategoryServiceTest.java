package it.homeo.categoryservice.services;

import it.homeo.categoryservice.dtos.AddCategoryRequestDto;
import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.dtos.UpdateCategoryRequestDto;
import it.homeo.categoryservice.exceptions.CategoryAlreadyExistsException;
import it.homeo.categoryservice.exceptions.CategoryNotFoundException;
import it.homeo.categoryservice.mappers.CategoryMapper;
import it.homeo.categoryservice.models.Category;
import it.homeo.categoryservice.repositories.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {
    @Mock
    private CategoryRepository repository;

    @Mock
    private CategoryMapper mapper;

    @InjectMocks
    private CategoryService underTest;

    @Captor
    private ArgumentCaptor<Category> categoryArgumentCaptor;

    @Test
    void shouldGetAllCategories() {
        Category category1 = new Category();
        Category category2 = new Category();
        List<Category> categories = List.of(category1, category2);

        when(repository.findAllByOrderByNameAsc()).thenReturn(categories);

        CategoryDto dto1 = CategoryDto.builder().build();
        CategoryDto dto2 = CategoryDto.builder().build();

        when(mapper.categoryToCategoryDto(category1)).thenReturn(dto1);
        when(mapper.categoryToCategoryDto(category2)).thenReturn(dto2);

        underTest.getAllCategories();

        verify(repository).findAllByOrderByNameAsc();
        verify(mapper, times(2)).categoryToCategoryDto(categoryArgumentCaptor.capture());

        List<Category> capturedCategories = categoryArgumentCaptor.getAllValues();
        assertThat(capturedCategories).containsExactly(category1, category2);
    }

    @Test
    void shouldGetCategoryById() {
        Long id = 1L;
        Category category = new Category();
        category.setId(id);

        CategoryDto dto = CategoryDto.builder()
                .id(id)
                .build();

        when(repository.findById(id)).thenReturn(Optional.of(category));
        when(mapper.categoryToCategoryDto(category)).thenReturn(dto);

        underTest.getCategoryById(id);

        verify(repository).findById(eq(id));
        verify(mapper).categoryToCategoryDto(categoryArgumentCaptor.capture());

        Category capturedCategory = categoryArgumentCaptor.getValue();
        assertThat(capturedCategory).isEqualTo(category);
    }

    @Test
    void shouldGetCategoryByIdThrowException() {
        Long id = 1L;

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(CategoryNotFoundException.class, () -> underTest.getCategoryById(id));

        verify(repository).findById(eq(id));
    }

    @Test
    void shouldAddCategory() {
        AddCategoryRequestDto dto = new AddCategoryRequestDto("categoryName");
        String userId = "user123";

        underTest.addCategory(dto, userId);

        verify(repository).save(categoryArgumentCaptor.capture());
        verify(mapper).categoryToCategoryDto(categoryArgumentCaptor.capture());
    }

    @Test
    void shouldThrowExceptionWhenAddingDuplicateCategory() {
        AddCategoryRequestDto dto = new AddCategoryRequestDto("duplicateName");
        String userId = "user123";

        when(repository.existsByNameIgnoreCase(anyString())).thenReturn(true);

        assertThrows(CategoryAlreadyExistsException.class, () -> underTest.addCategory(dto, userId));

        verify(repository, never()).save(any(Category.class));
    }

    @Test
    void shouldDeleteCategory() {
        Long id = 1L;
        Category category = new Category();
        category.setId(id);

        when(repository.findById(id)).thenReturn(Optional.of(category));

        underTest.deleteCategory(id);

        verify(repository).delete(eq(category));
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistingCategory() {
        Long id = 1L;

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(CategoryNotFoundException.class, () -> underTest.deleteCategory(id));

        verify(repository, never()).delete(any(Category.class));
    }

    @Test
    void shouldUpdateCategory() {
        Long id = 1L;
        String updatedName = "UpdatedCategoryName";
        UpdateCategoryRequestDto updateDto = new UpdateCategoryRequestDto(updatedName);
        String userId = "user123";

        Category existingCategory = new Category();
        existingCategory.setId(id);
        existingCategory.setName("OriginalCategoryName");

        when(repository.existsByNameIgnoreCase(updatedName.toUpperCase())).thenReturn(false);
        when(repository.findById(id)).thenReturn(Optional.of(existingCategory));

        underTest.updateCategory(id, updateDto, userId);

        verify(repository).save(categoryArgumentCaptor.capture());

        Category updatedCategory = categoryArgumentCaptor.getValue();
        assertThat(updatedCategory.getName()).isEqualTo(updatedName.toUpperCase());
    }

    @Test
    void shouldThrowExceptionWhenUpdatingToDuplicateName() {
        Long id = 1L;
        String updatedName = "DuplicateCategoryName";
        UpdateCategoryRequestDto updateDto = new UpdateCategoryRequestDto(updatedName);
        String userId = "user123";

        Category existingCategory = new Category();
        existingCategory.setId(id);
        existingCategory.setName("OriginalCategoryName");

        when(repository.existsByNameIgnoreCase(updatedName.toUpperCase())).thenReturn(true);

        assertThrows(CategoryAlreadyExistsException.class, () -> underTest.updateCategory(id, updateDto, userId));

        verify(repository, never()).save(any(Category.class));
    }

    @Test
    void shouldThrowExceptionWhenUpdatingNonExistingCategory() {
        Long nonExistingCategoryId = 999L;
        String updatedName = "UpdatedCategoryName";
        UpdateCategoryRequestDto updateDto = new UpdateCategoryRequestDto(updatedName);
        String userId = "user123";

        when(repository.findById(nonExistingCategoryId)).thenReturn(Optional.empty());

        assertThrows(CategoryNotFoundException.class, () -> underTest.updateCategory(nonExistingCategoryId, updateDto, userId));

        verify(repository, never()).save(any(Category.class));
    }

    @Test
    void shouldGetCategoryEntityById() {
        Long id = 1L;
        Category category = new Category();
        category.setId(id);

        when(repository.findById(id)).thenReturn(Optional.of(category));

        Category result = underTest.getCategoryEntityById(id);

        verify(repository).findById(id);
        assertThat(result).isEqualTo(category);
    }

    @Test
    void shouldThrowExceptionWhenGettingNonExistingCategoryEntityById() {
        Long nonExistingCategoryId = 999L;

        when(repository.findById(nonExistingCategoryId)).thenReturn(Optional.empty());

        assertThrows(CategoryNotFoundException.class, () -> underTest.getCategoryEntityById(nonExistingCategoryId));

        verify(repository).findById(nonExistingCategoryId);
    }
}
