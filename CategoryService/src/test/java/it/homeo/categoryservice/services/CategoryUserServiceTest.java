package it.homeo.categoryservice.services;

import it.homeo.categoryservice.dtos.AddUserToCategoryRequestDto;
import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.exceptions.CategoryUserAlreadyExistsException;
import it.homeo.categoryservice.exceptions.CategoryUserNotFoundException;
import it.homeo.categoryservice.exceptions.UserIdNotFoundException;
import it.homeo.categoryservice.mappers.CategoryMapper;
import it.homeo.categoryservice.models.Category;
import it.homeo.categoryservice.models.CategoryUser;
import it.homeo.categoryservice.repositories.CategoryUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryUserServiceTest {
    @Mock
    private CategoryUserRepository repository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryUserService underTest;

    @Captor
    private ArgumentCaptor<CategoryUser> categoryUserArgumentCaptor;

    @Test
    void shouldAddUserToCategory() {
        Long categoryId = 1L;
        String userId = "user123";

        AddUserToCategoryRequestDto requestDto = AddUserToCategoryRequestDto.builder()
                .categoryId(categoryId)
                .build();

        Category category = new Category();
        category.setId(categoryId);

        when(categoryService.getCategoryEntityById(categoryId)).thenReturn(category);
        when(repository.existsCategoryUserByCategoryAndUserId(category, userId)).thenReturn(false);

        CategoryUser savedCategoryUser = new CategoryUser();
        when(repository.save(any(CategoryUser.class))).thenReturn(savedCategoryUser);

        CategoryDto categoryDto = CategoryDto.builder().build();
        when(categoryMapper.categoryToCategoryDto(category)).thenReturn(categoryDto);

        CategoryDto result = underTest.addUserToCategory(requestDto, userId);

        verify(categoryService).getCategoryEntityById(categoryId);
        verify(repository).existsCategoryUserByCategoryAndUserId(category, userId);
        verify(repository).save(categoryUserArgumentCaptor.capture());
        verify(categoryMapper).categoryToCategoryDto(category);

        CategoryUser capturedCategoryUser = categoryUserArgumentCaptor.getValue();
        assertThat(capturedCategoryUser.getCategory()).isEqualTo(category);
        assertThat(capturedCategoryUser.getUserId()).isEqualTo(userId);
        assertThat(result).isEqualTo(categoryDto);
    }

    @Test
    void shouldThrowExceptionWhenAddingUserToCategoryAlreadyExists() {
        Long categoryId = 1L;
        String userId = "user123";

        AddUserToCategoryRequestDto requestDto = AddUserToCategoryRequestDto.builder()
                .categoryId(categoryId)
                .build();

        Category category = new Category();
        category.setId(categoryId);

        when(categoryService.getCategoryEntityById(categoryId)).thenReturn(category);
        when(repository.existsCategoryUserByCategoryAndUserId(category, userId)).thenReturn(true);

        assertThrows(CategoryUserAlreadyExistsException.class, () -> underTest.addUserToCategory(requestDto, userId));

        verify(categoryService).getCategoryEntityById(categoryId);
        verify(repository).existsCategoryUserByCategoryAndUserId(category, userId);
        verify(repository, never()).save(any(CategoryUser.class));
        verify(categoryMapper, never()).categoryToCategoryDto(any(Category.class));
    }

    @Test
    void shouldAddUserToCategoryThrowExceptionWhenUserIdIsNull() {
        Long categoryId = 1L;

        AddUserToCategoryRequestDto requestDto = AddUserToCategoryRequestDto.builder()
                .categoryId(categoryId)
                .build();

        assertThrows(UserIdNotFoundException.class, () -> underTest.addUserToCategory(requestDto, null));

        verify(categoryService, never()).getCategoryEntityById(anyLong());
        verify(repository, never()).existsCategoryUserByCategoryAndUserId(any(), any());
        verify(repository, never()).save(any(CategoryUser.class));
        verify(categoryMapper, never()).categoryToCategoryDto(any(Category.class));
    }

    @Test
    void shouldDeleteUserFromCategory() {
        Long categoryId = 1L;
        String userId = "user123";

        Category category = new Category();
        category.setId(categoryId);

        CategoryUser categoryUser = new CategoryUser();
        categoryUser.setCategory(category);
        categoryUser.setUserId(userId);

        when(categoryService.getCategoryEntityById(categoryId)).thenReturn(category);
        when(repository.findByCategoryAndUserId(category, userId)).thenReturn(java.util.Optional.of(categoryUser));

        underTest.deleteUserFromCategory(categoryId, userId);

        verify(categoryService).getCategoryEntityById(categoryId);
        verify(repository).findByCategoryAndUserId(category, userId);
        verify(repository).delete(categoryUser);
    }


    @Test
    void shouldThrowExceptionWhenUserNotInCategory() {
        Long categoryId = 1L;
        String userId = "user123";

        Category category = new Category();
        category.setId(categoryId);

        when(categoryService.getCategoryEntityById(categoryId)).thenReturn(category);
        when(repository.findByCategoryAndUserId(category, userId)).thenReturn(java.util.Optional.empty());

        assertThrows(CategoryUserNotFoundException.class, () -> underTest.deleteUserFromCategory(categoryId, userId));

        verify(categoryService).getCategoryEntityById(categoryId);
        verify(repository).findByCategoryAndUserId(category, userId);
        verify(repository, never()).delete(any(CategoryUser.class));
    }

    @Test
    void shouldDeleteUserFromCategoryThrowExceptionWhenUserIdIsNull() {
        Long categoryId = 1L;

        assertThrows(UserIdNotFoundException.class, () -> underTest.deleteUserFromCategory(categoryId, null));

        verify(categoryService, never()).getCategoryEntityById(anyLong());
        verify(repository, never()).findByCategoryAndUserId(any(), any());
        verify(repository, never()).delete(any(CategoryUser.class));
    }

    @Test
    void shouldDeleteUserFromAllCategories() {
        String userId = "user123";

        underTest.deleteUserFromAllCategories(userId);

        verify(repository).deleteAllByUserId(userId);
    }

    @Test
    void shouldDeleteUserFromAllCategoriesThrowExceptionWhenUserIdIsNull() {
        assertThrows(UserIdNotFoundException.class, () -> underTest.deleteUserFromAllCategories(null));
        verify(repository, never()).deleteAllByUserId(anyString());
    }

    @Test
    void shouldGetUserCategories() {
        String userId = "user123";

        CategoryUser categoryUser1 = new CategoryUser();
        categoryUser1.setCategory(new Category());
        CategoryUser categoryUser2 = new CategoryUser();
        categoryUser2.setCategory(new Category());
        List<CategoryUser> categoryUsers = List.of(categoryUser1, categoryUser2);

        when(repository.findByUserId(userId)).thenReturn(categoryUsers);

        CategoryDto categoryDto1 = CategoryDto.builder().build();
        CategoryDto categoryDto2 = CategoryDto.builder().build();

        when(categoryMapper.categoryToCategoryDto(categoryUser1.getCategory())).thenReturn(categoryDto1);
        when(categoryMapper.categoryToCategoryDto(categoryUser2.getCategory())).thenReturn(categoryDto2);

        List<CategoryDto> result = underTest.getUserCategories(userId);

        verify(repository).findByUserId(userId);
        verify(categoryMapper, times(2)).categoryToCategoryDto(any(Category.class));

        assertThat(result).containsExactly(categoryDto1, categoryDto2);
    }

    @Test
    void shouldGetUserCategoriesThrowExceptionWhenUserIdIsNull() {
        assertThrows(UserIdNotFoundException.class, () -> underTest.getUserCategories(null));

        verify(repository, never()).findByUserId(anyString());
        verify(categoryMapper, never()).categoryToCategoryDto(any(Category.class));
    }
}
