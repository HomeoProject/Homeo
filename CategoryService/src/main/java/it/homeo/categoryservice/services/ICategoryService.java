package it.homeo.categoryservice.services;

import it.homeo.categoryservice.dtos.AddCategoryRequestDto;
import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.dtos.UpdateCategoryRequestDto;
import it.homeo.categoryservice.models.Category;

import java.util.List;

public interface ICategoryService {
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(Long id);
    CategoryDto addCategory(AddCategoryRequestDto dto, String userId);
    CategoryDto updateCategory(Long id, UpdateCategoryRequestDto dto, String userId);
    void deleteCategory(Long id);
    Category getCategoryEntityById(Long id);
}
