package it.homeo.categoryservice.controllers;

import it.homeo.categoryservice.config.AuthUtils;
import it.homeo.categoryservice.dtos.AddCategoryRequestDto;
import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.dtos.UpdateCategoryRequestDto;
import it.homeo.categoryservice.services.ICategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final ICategoryService service;
    private final AuthUtils authUtils;

    public CategoryController(ICategoryService service, AuthUtils authUtils) {
        this.service = service;
        this.authUtils = authUtils;
    }

    @GetMapping
    public List<CategoryDto> getAllCategories() {
        return service.getAllCategories();
    }

    @GetMapping("/{id}")
    public CategoryDto getCategoryById(@PathVariable Long id) {
        return service.getCategoryById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDto addCategory(@Valid @RequestBody AddCategoryRequestDto dto) {
        return service.addCategory(dto, authUtils.getUserId());
    }

    @PutMapping("/{id}")
    public CategoryDto updateCategory(@PathVariable Long id, @Valid @RequestBody UpdateCategoryRequestDto dto) {
        return service.updateCategory(id, dto, authUtils.getUserId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
    }
}
