package it.homeo.constructorservice.services;

import it.homeo.constructorservice.models.Category;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategory(Long id);
    Category addCategory(Category category);
    Category updateCategoryImage(Long id, MultipartFile file);
    Category updateCategory(Long id, String name, String description);
    Category deleteCategoryImage(Long id);
    Set<Category> getCategoriesFromIds(Set<Long> categoryIds);
    void deleteCategory(Long id);
}
