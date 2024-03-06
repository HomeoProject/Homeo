package it.homeo.constructorservice.exceptions;

public class NotFoundException extends RuntimeException {
    public NotFoundException(Long id, String modelName) {
        super("%s with id '%s' not found".formatted(modelName, id));
    }
}
