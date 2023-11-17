package it.homeo.userservice.exceptions;

public class AppUserNotFoundException extends RuntimeException {
    public AppUserNotFoundException(String id) {
        super("User with id '%s' not found.".formatted(id));
    }
}
