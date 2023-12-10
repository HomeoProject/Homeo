package it.homeo.categoryservice.controllers;

import it.homeo.categoryservice.config.AuthUtils;
import it.homeo.categoryservice.dtos.AddUserToCategoryRequestDto;
import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.services.ICategoryUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories/users")
public class CategoryUserController {

    private final ICategoryUserService service;
    private final AuthUtils authUtils;

    public CategoryUserController(ICategoryUserService service, AuthUtils authUtils) {
        this.service = service;
        this.authUtils = authUtils;
    }

    @GetMapping
    public List<CategoryDto> getUserCategories() {
        return service.getUserCategories(authUtils.getUserId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserFromCategory(@PathVariable Long id) {
        service.deleteUserFromCategory(id, authUtils.getUserId());
    }

    @PostMapping
    public CategoryDto addUserToCategory(@Valid @RequestBody AddUserToCategoryRequestDto dto) {
        return service.addUserToCategory(dto, authUtils.getUserId());
    }
}
