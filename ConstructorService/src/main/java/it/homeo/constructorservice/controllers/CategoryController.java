package it.homeo.constructorservice.controllers;

import it.homeo.constructorservice.dtos.request.AddCategoryDto;
import it.homeo.constructorservice.dtos.request.UpdateCategoryDto;
import it.homeo.constructorservice.dtos.request.UpdateCategoryImageDto;
import it.homeo.constructorservice.dtos.response.CategoryDto;
import it.homeo.constructorservice.exceptions.BadRequestException;
import it.homeo.constructorservice.mappers.CategoryMapper;
import it.homeo.constructorservice.models.Category;
import it.homeo.constructorservice.services.CategoryService;
import it.homeo.constructorservice.validators.FileValidator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;


// Any change operation is accessible only to ADMIN
@RestController
@RequestMapping("/api/constructors/categories")
public class CategoryController extends AbstractControllerBase {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    public CategoryController(CategoryService categoryService, CategoryMapper categoryMapper) {
        this.categoryService = categoryService;
        this.categoryMapper = categoryMapper;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        logger.info("Inside: CategoryController -> getAllCategories()...");
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories.stream().map(categoryMapper::toDto).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long id) {
        logger.info("Inside: CategoryController -> getCategory()...");
        Category category = categoryService.getCategory(id);
        return ResponseEntity.ok(categoryMapper.toDto(category));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> addCategory(@RequestBody @Valid AddCategoryDto dto, HttpServletRequest request) {
        logger.info("Inside: CategoryController -> addCategory()...");
        Category category = categoryMapper.toEntity(dto);
        category = categoryService.addCategory(category);
        URI location = getURILocationFromRequest(category.getId(), request);
        return ResponseEntity.created(location).body(categoryMapper.toDto(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@RequestBody @Valid UpdateCategoryDto dto, @PathVariable Long id) {
        logger.info("Inside: CategoryController -> updateCategory()...");
        Category category = categoryService.updateCategory(id, dto.name(), dto.description());
        return ResponseEntity.ok(categoryMapper.toDto(category));
    }

    @PutMapping("image/{id}")
    public ResponseEntity<CategoryDto> updateCategoryImage(@PathVariable Long id, UpdateCategoryImageDto dto) {
        logger.info("Inside: CategoryController -> updateCategoryImage()...");
        if (!FileValidator.isImage(dto.file())) {
            throw new BadRequestException("File must be an image.");
        }
        Category category = categoryService.updateCategoryImage(id, dto.file());
        return ResponseEntity.ok(categoryMapper.toDto(category));
    }

    @DeleteMapping("/image/{id}")
    public ResponseEntity<CategoryDto> deleteCategoryImage(@PathVariable Long id) {
        logger.info("Inside: CategoryController -> deleteCategoryImage()...");
        Category category = categoryService.deleteCategoryImage(id);
        return ResponseEntity.ok(categoryMapper.toDto(category));
    }

    // If a product has a category assigned to it, it cannot be removed
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        logger.info("Inside: CategoryController -> deleteCategory()...");
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
