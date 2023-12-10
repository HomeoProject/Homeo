package it.homeo.categoryservice.services;


import com.fasterxml.jackson.core.JsonProcessingException;
import it.homeo.categoryservice.dtos.AddUserToCategoryRequestDto;
import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.dtos.CategoryUserDto;
import it.homeo.categoryservice.exceptions.CategoryUserAlreadyExistsException;
import it.homeo.categoryservice.exceptions.CategoryUserNotFoundException;
import it.homeo.categoryservice.exceptions.UserIdNotFoundException;
import it.homeo.categoryservice.mappers.CategoryMapper;
import it.homeo.categoryservice.messaging.producers.CategoryUserKafkaProducer;
import it.homeo.categoryservice.models.Category;
import it.homeo.categoryservice.models.CategoryUser;
import it.homeo.categoryservice.repositories.CategoryUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CategoryUserService implements ICategoryUserService {

    private final CategoryUserRepository repository;
    private final ICategoryService categoryService;
    private final CategoryMapper categoryMapper;
    private final CategoryUserKafkaProducer kafkaProducer;

    public CategoryUserService(
            CategoryUserRepository repository,
            CategoryService categoryService,
            CategoryMapper categoryMapper,
            CategoryUserKafkaProducer kafkaProducer
    ) {
        this.repository = repository;
        this.categoryService = categoryService;
        this.categoryMapper = categoryMapper;
        this.kafkaProducer = kafkaProducer;
    }

    @Override
    @Transactional
    public CategoryDto addUserToCategory(AddUserToCategoryRequestDto dto, String userId) {
        validateUserId(userId);
        Long categoryId = dto.categoryId();
        Category category = categoryService.getCategoryEntityById(categoryId);

        if (repository.existsCategoryUserByCategoryAndUserId(category, userId)) {
            throw new CategoryUserAlreadyExistsException(userId, categoryId);
        }

        CategoryUser categoryUser = new CategoryUser();
        categoryUser.setCategory(category);
        categoryUser.setUserId(userId);
        repository.save(categoryUser);

        CategoryUserDto categoryUserDto = new CategoryUserDto(userId, categoryId, category.getName());
        try {
            kafkaProducer.produceAddUserToCategoryEvent(categoryUserDto);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        return categoryMapper.categoryToCategoryDto(category);
    }

    @Override
    @Transactional
    public void deleteUserFromCategory(Long categoryId, String userId) {
        validateUserId(userId);
        Category category = categoryService.getCategoryEntityById(categoryId);
        CategoryUser categoryUser = repository
                .findByCategoryAndUserId(category, userId)
                .orElseThrow(() -> new CategoryUserNotFoundException(userId, categoryId));
        repository.delete(categoryUser);

        CategoryUserDto categoryUserDto = new CategoryUserDto(userId, categoryId, category.getName());
        try {
            kafkaProducer.producerDeleteUserFromCategoryEvent(categoryUserDto);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void deleteUserFromAllCategories(String userId) {
        validateUserId(userId);
        repository.deleteAllByUserId(userId);
    }

    @Override
    public List<CategoryDto> getUserCategories(String userId) {
        validateUserId(userId);
        List<CategoryUser> categoryUsers = repository.findByUserId(userId);
        return categoryUsers.stream()
                .map((categoryUser) -> categoryMapper.categoryToCategoryDto(categoryUser.getCategory()))
                .toList();
    }


    private void validateUserId(String userId) {
        if (userId == null) {
            throw new UserIdNotFoundException("User ID is null. Authentication failed.");
        }
    }
}
