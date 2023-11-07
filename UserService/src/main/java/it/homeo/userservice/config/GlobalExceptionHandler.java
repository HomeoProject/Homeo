package it.homeo.userservice.config;

import com.auth0.exception.Auth0Exception;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(Auth0Exception.class)
    protected ResponseEntity<Object> handleAuth0Exception(Auth0Exception exception, WebRequest request) {
        int statusCode = extractErrorCodeFromAuth0ExceptionMessage(exception.getMessage());
        CustomError error = new CustomError(statusCode, HttpStatus.valueOf(statusCode), exception.getMessage(), LocalDateTime.now());
        return handleExceptionInternal(exception, error, new HttpHeaders(), HttpStatus.valueOf(statusCode), request);
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

    private record CustomError(int statusCode, HttpStatus status, String message, LocalDateTime timestamp) { }
}
