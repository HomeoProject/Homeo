package it.homeo.constructorservice.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

public abstract class AbstractControllerBase {

    protected final Logger logger = LoggerFactory.getLogger(getClass());

    protected URI getURILocationFromRequest(Long id, HttpServletRequest request) {
        return ServletUriComponentsBuilder
                .fromRequest(request)
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
    }

    protected String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
