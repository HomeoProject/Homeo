package it.homeo.userservice.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class AppUserNotFoundException extends RuntimeException {
    public AppUserNotFoundException(String id) {
        super("User with id '%s' not found".formatted(id));
    }
}
