package it.homeo.categoryservice.exceptions;

public class UserIdNotFoundException extends RuntimeException {
    public UserIdNotFoundException(String message) {
        super(message);
    }
}
