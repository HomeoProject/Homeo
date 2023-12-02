package it.homeo.categoryservice.services;

import it.homeo.categoryservice.dtos.AddCategoryRequestDto;
import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.dtos.UpdateCategoryRequestDto;

import java.util.List;

public interface ICategoryService {
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(Long id);
    CategoryDto addCategory(AddCategoryRequestDto dto);
    CategoryDto updateCategory(Long id, UpdateCategoryRequestDto dto);
    void deleteCategory(Long id);
}
