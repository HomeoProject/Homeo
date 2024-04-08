package it.homeo.searchservice.controllers;

import it.homeo.searchservice.dtos.request.ConstructorSearchFilterDto;
import it.homeo.searchservice.models.ConstructorSearch;
import it.homeo.searchservice.services.ConstructorSearchService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class ConstructorSearchController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ConstructorSearchController.class);
    private final ConstructorSearchService constructorSearchService;

    public ConstructorSearchController(ConstructorSearchService constructorSearchService) {
        this.constructorSearchService = constructorSearchService;
    }

    @PostMapping
    public Page<ConstructorSearch> searchConstructorSearch(@Valid @RequestBody ConstructorSearchFilterDto dto, Pageable pageable) {
        LOGGER.info("Inside: ConstructorSearchController -> searchConstructorSearch()...");
        return constructorSearchService.searchConstructorsSearch(dto, pageable);
    }
}
