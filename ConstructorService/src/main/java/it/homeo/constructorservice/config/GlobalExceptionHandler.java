package it.homeo.constructorservice.config;

import com.auth0.exception.Auth0Exception;
import it.homeo.constructorservice.exceptions.AlreadyExistsException;
import it.homeo.constructorservice.exceptions.BadRequestException;
import it.homeo.constructorservice.exceptions.EntityInUseException;
import it.homeo.constructorservice.exceptions.NotFoundException;
import jakarta.annotation.Nonnull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    protected ResponseEntity<Object> handleNotFoundException(NotFoundException ex, WebRequest request) {
        CustomError error = new CustomError(HttpStatus.NOT_FOUND.value(), HttpStatus.NOT_FOUND, ex.getMessage(), getPath(request), Instant.now());
        return handleExceptionInternal(ex, error, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(AlreadyExistsException.class)
    protected ResponseEntity<Object> handleAlreadyExistsException(AlreadyExistsException ex, WebRequest request) {
        CustomError error = new CustomError(HttpStatus.CONFLICT.value(), HttpStatus.CONFLICT, ex.getMessage(), getPath(request), Instant.now());
        return handleExceptionInternal(ex, error, new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(EntityInUseException.class)
    protected ResponseEntity<Object> handleEntityInUseException(EntityInUseException ex, WebRequest request) {
        CustomError error = new CustomError(HttpStatus.CONFLICT.value(), HttpStatus.CONFLICT, ex.getMessage(), getPath(request), Instant.now());
        return handleExceptionInternal(ex, error, new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(BadRequestException.class)
    protected ResponseEntity<Object> handleBadRequestException(BadRequestException ex, WebRequest request) {
        CustomError error = new CustomError(HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST, ex.getMessage(), getPath(request), Instant.now());
        return handleExceptionInternal(ex, error, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, @Nonnull HttpHeaders headers, @Nonnull HttpStatusCode status, @Nonnull WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        Objects.requireNonNull(ex.getBindingResult()).getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        CustomErrors error = new CustomErrors(HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST, errors, getPath(request), Instant.now());
        return handleExceptionInternal(ex, error, headers, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(Auth0Exception.class)
    protected ResponseEntity<Object> handleAuth0Exception(Auth0Exception ex, WebRequest request) {
        int statusCode = extractErrorCodeFromAuth0ExceptionMessage(ex.getMessage());
        CustomError error = new CustomError(statusCode, HttpStatus.valueOf(statusCode), ex.getMessage(), getPath(request), Instant.now());
        return handleExceptionInternal(ex, error, new HttpHeaders(), HttpStatus.valueOf(statusCode), request);
    }

    private int extractErrorCodeFromAuth0ExceptionMessage(String errorMessage) {
        Pattern pattern = Pattern.compile("status code (\\d+):");
        Matcher matcher = pattern.matcher(errorMessage);

        if (!matcher.find()) {
            return 500;
        }

        try {
            return Integer.parseInt(matcher.group(1));
        } catch (NumberFormatException e) {
            return 500;
        }
    }

    private String getPath(WebRequest request) {
        return ((ServletWebRequest)request).getRequest().getRequestURI();
    }

    private record CustomError(int statusCode, HttpStatus status, String message, String path, Instant timestamp) { }

    private record CustomErrors(int statusCode, HttpStatus status, Map<String, String> errors, String path, Instant timestamp) { }
}
