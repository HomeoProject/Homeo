package it.homeo.categoryservice.services;


import it.homeo.categoryservice.dtos.AddCategoryRequestDto;
import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.dtos.UpdateCategoryRequestDto;
import it.homeo.categoryservice.exceptions.CategoryAlreadyExistsException;
import it.homeo.categoryservice.exceptions.CategoryNotFoundException;
import it.homeo.categoryservice.mappers.CategoryMapper;
import it.homeo.categoryservice.models.Category;
import it.homeo.categoryservice.repositories.CategoryRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService implements ICategoryService {
    private final CategoryRepository repository;
    private final CategoryMapper mapper;

    public CategoryService(CategoryRepository repository, CategoryMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        return repository.findAllByOrderByNameAsc().stream().map(mapper::categoryToCategoryDto).toList();
    }

    @Override
    public CategoryDto getCategoryById(Long id) {
        Category category = repository.findById(id).orElseThrow(() -> new CategoryNotFoundException(id));
        return mapper.categoryToCategoryDto(category);
    }

    @Override
    public CategoryDto addCategory(AddCategoryRequestDto dto) {
        String name = dto.name().toUpperCase();

        if (repository.existsByNameIgnoreCase(name)) {
            throw new CategoryAlreadyExistsException(name);
        }

        Category category = new Category();
        category.setName(name);
        category.setCreatedBy(getUserId());
        category = repository.save(category);

        return mapper.categoryToCategoryDto(category);
    }

    @Override
    public CategoryDto updateCategory(Long id, UpdateCategoryRequestDto dto) {
        String newName = dto.name().toUpperCase();

        if (repository.existsByNameIgnoreCase(newName)) {
            throw new CategoryAlreadyExistsException(newName);
        }

        Category category = repository.findById(id).orElseThrow(() -> new CategoryNotFoundException(id));
        category.setName(newName);
        category.setUpdatedBy(getUserId());
        category = repository.save(category);

        return mapper.categoryToCategoryDto(category);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = repository.findById(id).orElseThrow(() -> new CategoryNotFoundException(id));
        repository.delete(category);
    }

    private String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null) ? authentication.getName() : null;
    }
}
