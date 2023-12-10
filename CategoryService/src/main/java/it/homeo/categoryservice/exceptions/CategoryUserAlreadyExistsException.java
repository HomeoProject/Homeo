package it.homeo.categoryservice.exceptions;

public class CategoryUserAlreadyExistsException extends RuntimeException {
    public CategoryUserAlreadyExistsException(String userId, Long categoryId) {
        super("User with id '%s' is already in category with id '%s' .".formatted(userId, categoryId));
    }
}
