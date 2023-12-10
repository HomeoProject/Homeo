package it.homeo.categoryservice.services;


import it.homeo.categoryservice.dtos.AddCategoryRequestDto;
import it.homeo.categoryservice.dtos.CategoryDto;
import it.homeo.categoryservice.dtos.UpdateCategoryRequestDto;
import it.homeo.categoryservice.exceptions.CategoryAlreadyExistsException;
import it.homeo.categoryservice.exceptions.CategoryNotFoundException;
import it.homeo.categoryservice.mappers.CategoryMapper;
import it.homeo.categoryservice.messaging.producers.CategoryKafkaProducer;
import it.homeo.categoryservice.models.Category;
import it.homeo.categoryservice.repositories.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService implements ICategoryService {
    private final CategoryRepository repository;
    private final CategoryMapper mapper;
    private final CategoryKafkaProducer kafkaProducer;

    public CategoryService(CategoryRepository repository, CategoryMapper mapper, CategoryKafkaProducer kafkaProducer) {
        this.repository = repository;
        this.mapper = mapper;
        this.kafkaProducer = kafkaProducer;
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
    public CategoryDto addCategory(AddCategoryRequestDto dto, String userId) {
        String name = dto.name().toUpperCase();

        if (repository.existsByNameIgnoreCase(name)) {
            throw new CategoryAlreadyExistsException(name);
        }

        Category category = new Category();
        category.setName(name);
        category.setCreatedBy(userId);
        category = repository.save(category);

        return mapper.categoryToCategoryDto(category);
    }

    @Override
    public CategoryDto updateCategory(Long id, UpdateCategoryRequestDto dto, String userId) {
        String newName = dto.name().toUpperCase();

        if (repository.existsByNameIgnoreCase(newName)) {
            throw new CategoryAlreadyExistsException(newName);
        }

        Category category = repository.findById(id).orElseThrow(() -> new CategoryNotFoundException(id));
        category.setName(newName);
        category.setUpdatedBy(userId);
        category = repository.save(category);

        return mapper.categoryToCategoryDto(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = repository.findById(id).orElseThrow(() -> new CategoryNotFoundException(id));
        repository.delete(category);
        kafkaProducer.produceDeleteCategoryEvent(id);
    }

    public Category getCategoryEntityById(Long id) {
        return repository.findById(id).orElseThrow(() -> new CategoryNotFoundException(id));
    }
}
