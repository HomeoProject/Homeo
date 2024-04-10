package it.homeo.constructorservice.exceptions;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(Long id, String modelName) {
        super(modelName + " with id: " + id + " not found");
    }
}
