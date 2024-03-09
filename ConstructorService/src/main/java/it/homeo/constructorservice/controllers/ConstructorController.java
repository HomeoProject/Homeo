package it.homeo.constructorservice.controllers;

import com.auth0.exception.Auth0Exception;
import it.homeo.constructorservice.dtos.request.AddConstructorDto;
import it.homeo.constructorservice.dtos.request.UpdateConstructorDto;
import it.homeo.constructorservice.dtos.response.ConstructorDto;
import it.homeo.constructorservice.mappers.ConstructorMapper;
import it.homeo.constructorservice.models.Constructor;
import it.homeo.constructorservice.services.ConstructorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/constructors/constructor")
public class ConstructorController extends AbstractControllerBase {

    private final ConstructorService constructorService;
    private final ConstructorMapper constructorMapper;

    public ConstructorController(ConstructorService constructorService, ConstructorMapper constructorMapper) {
        this.constructorService = constructorService;
        this.constructorMapper = constructorMapper;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ConstructorDto> getConstructorByUserId(@PathVariable String userId) {
        logger.info("Inside: ConstructorController -> getConstructorByUserId()...");
        Constructor constructor = constructorService.getConstructorByUserId(userId);
        return ResponseEntity.ok(constructorMapper.toDto(constructor));
    }

    @PostMapping
    public ResponseEntity<ConstructorDto> addConstructor(@RequestBody @Valid AddConstructorDto dto, HttpServletRequest request) throws Auth0Exception {
        logger.info("Inside: ConstructorController -> addConstructor()...");
        String userId = getUserId();
        Constructor constructor = constructorMapper.toEntity(dto, userId);
        constructor = constructorService.addConstructor(constructor);
        URI location = getURILocationFromRequest(constructor.getId(), request);
        return ResponseEntity.created(location).body(constructorMapper.toDto(constructor));
    }

    @PutMapping
    public ResponseEntity<ConstructorDto> updateConstructorByUserId(@RequestBody @Valid UpdateConstructorDto dto) {
        logger.info("Inside: ConstructorController -> updateConstructorByUserId()...");
        String userId = getUserId();
        Constructor newConstructor = constructorMapper.toEntity(dto);
        Constructor updatedConstructor = constructorService.updateConstructorByUserId(userId, newConstructor);
        return ResponseEntity.ok(constructorMapper.toDto(updatedConstructor));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteConstructorByUserId() throws Auth0Exception {
        logger.info("Inside: ConstructorController -> deleteConstructorByUserId()...");
        String userId = getUserId();
        constructorService.deleteConstructorByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}
