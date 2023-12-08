package it.homeo.categoryservice.services;

import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.dtos.AddUserToCategoryRequestDto;

import java.util.List;

public interface ICategoryUserService {
    CategoryDto addUserToCategory(AddUserToCategoryRequestDto dto, String userId);
    void deleteUserFromCategory(Long categoryId, String userId);
    void deleteUserFromAllCategories(String userId);
    List<CategoryDto> getUserCategories(String userId);
}
