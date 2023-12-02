package it.homeo.categoryservice.config;

import it.homeo.categoryservice.exceptions.CategoryAlreadyExistsException;
import it.homeo.categoryservice.exceptions.CategoryNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(CategoryNotFoundException.class)
    protected ResponseEntity<Object> handleCategoryNotFoundException(CategoryNotFoundException ex, WebRequest request) {
        CustomError error = new CustomError(HttpStatus.NOT_FOUND.value(), HttpStatus.NOT_FOUND, ex.getMessage(), LocalDateTime.now());
        return handleExceptionInternal(ex, error, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(CategoryAlreadyExistsException.class)
    protected ResponseEntity<Object> handleCategoryAlreadyExistsException(CategoryAlreadyExistsException ex, WebRequest request) {
        CustomError error = new CustomError(HttpStatus.CONFLICT.value(), HttpStatus.CONFLICT, ex.getMessage(), LocalDateTime.now());
        return handleExceptionInternal(ex, error, new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    private record CustomError(int statusCode, HttpStatus status, String message, LocalDateTime timestamp) { }
}
