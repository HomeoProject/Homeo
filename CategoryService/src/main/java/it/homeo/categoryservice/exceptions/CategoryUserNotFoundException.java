package it.homeo.categoryservice.exceptions;

public class CategoryUserNotFoundException extends RuntimeException {
    public CategoryUserNotFoundException(String userId, Long categoryId) {
        super("User with id '%s' is not in category with id '%s' .".formatted(userId, categoryId));
    }
}
