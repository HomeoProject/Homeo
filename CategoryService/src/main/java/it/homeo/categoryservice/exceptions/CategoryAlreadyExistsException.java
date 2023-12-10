package it.homeo.categoryservice.exceptions;

public class CategoryAlreadyExistsException extends RuntimeException {
    public CategoryAlreadyExistsException(String name) {
        super("Category with name '%s' already exists.".formatted(name));
    }
}
