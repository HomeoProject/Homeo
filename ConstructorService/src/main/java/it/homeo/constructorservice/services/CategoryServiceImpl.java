package it.homeo.constructorservice.services;

import it.homeo.constructorservice.config.CloudinaryProperties;
import it.homeo.constructorservice.dtos.response.CloudinaryDto;
import it.homeo.constructorservice.exceptions.AlreadyExistsException;
import it.homeo.constructorservice.exceptions.BadRequestException;
import it.homeo.constructorservice.exceptions.EntityInUseException;
import it.homeo.constructorservice.exceptions.NotFoundException;
import it.homeo.constructorservice.models.Category;
import it.homeo.constructorservice.repositories.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;
    private final CloudinaryProperties cloudinaryProperties;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CloudinaryService cloudinaryService, CloudinaryProperties cloudinaryProperties) {
        this.categoryRepository = categoryRepository;
        this.cloudinaryService = cloudinaryService;
        this.cloudinaryProperties = cloudinaryProperties;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategory(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new NotFoundException(id, "Category"));
    }

    @Override
    public Category addCategory(Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new AlreadyExistsException("Category with name '%s' already exists".formatted(category.getName()));
        }
        category.setImage(cloudinaryProperties.getDefaultCategoryImage());
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategoryImage(Long id, MultipartFile file) {
        Category category = getCategory(id);
        if (category.getImageId() != null) {
            cloudinaryService.deleteFile(category.getImageId());
        }
        CloudinaryDto cloudinaryDto = cloudinaryService.uploadFile(file);
        category.setImage(cloudinaryDto.imageUrl());
        category.setImageId(cloudinaryDto.publicId());
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, String name, String description) {
        Category category = getCategory(id);
        category.setName(name);
        category.setDescription(description);
        return categoryRepository.save(category);
    }

    @Override
    public Category deleteCategoryImage(Long id) {
        Category category = getCategory(id);
        if (category.getImageId() != null) {
            cloudinaryService.deleteFile(category.getImageId());
            category.setImageId(null);
        }
        category.setImage(cloudinaryProperties.getDefaultCategoryImage());
        return categoryRepository.save(category);
    }

    @Override
    public Set<Category> getCategoriesFromIds(Set<Long> categoryIds) {
        Set<Category> categories = new HashSet<>(categoryRepository.findAllById(categoryIds));
        if (categories.size() != categoryIds.size()) {
            throw new BadRequestException("Not every category provided exists");
        }
        return categories;
    }

    @Override
    public void deleteCategory(Long id) {
        if (categoryRepository.existsConstructorInCategory(id)) {
            throw new EntityInUseException("Category with id '%s' is in use by constructors".formatted(id));
        }
        Category category = getCategory(id);
        if (category.getImageId() != null) {
            cloudinaryService.deleteFile(category.getImageId());
        }
        categoryRepository.delete(category);
    }
}
