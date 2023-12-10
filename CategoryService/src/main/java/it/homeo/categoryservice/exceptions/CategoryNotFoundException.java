package it.homeo.categoryservice.exceptions;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(Long id) {
        super("Category with id '%s' not found".formatted(id));
    }
}
