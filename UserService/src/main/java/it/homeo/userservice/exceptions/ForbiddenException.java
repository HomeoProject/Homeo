package it.homeo.userservice.exceptions;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException() {
        super("Access denied: You do not have the necessary permissions to perform this operation.");
    }
}
