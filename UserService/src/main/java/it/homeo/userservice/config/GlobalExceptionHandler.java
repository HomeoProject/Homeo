package it.homeo.userservice.config;

import com.auth0.exception.Auth0Exception;
import it.homeo.userservice.exceptions.AppUserNotFoundException;
import it.homeo.userservice.exceptions.BadRequestException;
import it.homeo.userservice.exceptions.ForbiddenException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ForbiddenException.class)
    protected ResponseEntity<Object> handleAppUserNotFoundException(ForbiddenException ex, WebRequest request) {
        CustomError error = new CustomError(HttpStatus.FORBIDDEN.value(), HttpStatus.FORBIDDEN, ex.getMessage(), getPath(request), LocalDateTime.now());
        return handleExceptionInternal(ex, error, new HttpHeaders(), HttpStatus.FORBIDDEN, request);
    }

    @ExceptionHandler(AppUserNotFoundException.class)
    protected ResponseEntity<Object> handleAppUserNotFoundException(AppUserNotFoundException ex, WebRequest request) {
        CustomError error = new CustomError(HttpStatus.NOT_FOUND.value(), HttpStatus.NOT_FOUND, ex.getMessage(), getPath(request), LocalDateTime.now());
        return handleExceptionInternal(ex, error, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler({BadRequestException.class})
    protected ResponseEntity<Object> handleBadRequestException(BadRequestException ex, WebRequest request) {
        CustomError error = new CustomError(HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST, ex.getMessage(), getPath(request), LocalDateTime.now());
        return handleExceptionInternal(ex, error, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(Auth0Exception.class)
    protected ResponseEntity<Object> handleAuth0Exception(Auth0Exception ex, WebRequest request) {
        int statusCode = extractErrorCodeFromAuth0ExceptionMessage(ex.getMessage());
        CustomError error = new CustomError(statusCode, HttpStatus.valueOf(statusCode), ex.getMessage(), getPath(request), LocalDateTime.now());
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

    private record CustomError(int statusCode, HttpStatus status, String message, String path, LocalDateTime timestamp) { }}
