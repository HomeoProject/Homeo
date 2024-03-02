package it.homeo.userservice.controllers;

import com.auth0.exception.Auth0Exception;
import it.homeo.userservice.dtos.request.*;
import it.homeo.userservice.dtos.response.AppUserDto;
import it.homeo.userservice.exceptions.BadRequestException;
import it.homeo.userservice.services.IAppUserService;
import it.homeo.userservice.validators.FileValidator;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    private final Logger logger = LoggerFactory.getLogger(AppUserController.class);
    private final IAppUserService service;

    public AppUserController(IAppUserService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUserDto> getAppUserById(@PathVariable String id) {
        logger.info("Inside: AppUserController -> getAppUserById()...");
        AppUserDto appUserDto = service.getAppUserById(id);
        return ResponseEntity.ok(appUserDto);
    }

    /*
    Endpoint that we should execute after logging in.
    It compares the data with auth0 and checks whether the user already exists in our database.
     */
    @PostMapping
    public ResponseEntity<AppUserDto> checkAppUserAfterLogin(@Valid @RequestBody CheckAppUserAfterLoginRequest dto) throws Auth0Exception {
        logger.info("Inside: AppUserController -> checkAppUserAfterLogin()...");
        AppUserDto appUserDto = service.checkAppUserAfterLogin(dto);
        return ResponseEntity.ok(appUserDto);
    }

    /*
    Endpoint requires sending all DTO fields
    */
    @PutMapping("/{id}")
    public ResponseEntity<AppUserDto> updateAppUser(@PathVariable String id, @Valid @RequestBody UpdateAppUserRequest dto) {
        logger.info("Inside: AppUserController -> updateAppUser()...");
        AppUserDto appUserDto = service.updateAppUser(id, dto);
        return ResponseEntity.ok(appUserDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppUser(@PathVariable String id) throws Auth0Exception {
        logger.info("Inside: AppUserController -> deleteAppUser()...");
        service.deleteAppUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/constructor/{id}")
    public ResponseEntity<Void> updateAppUserIsConstructor(@PathVariable String id, @Valid @RequestBody UpdateAppUserIsConstructorRequest dto) throws Auth0Exception {
        logger.info("Inside: AppUserController -> updateAppUserIsConstructor()...");
        service.updateAppUserIsConstructor(id, dto);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/email/{id}")
    public ResponseEntity<AppUserDto> updateAppUserEmail(@PathVariable String id, @Valid @RequestBody UpdateAppUserEmailRequest dto) throws Auth0Exception {
        logger.info("Inside: AppUserController -> updateAppUserEmail()...");
        AppUserDto appUserDto = service.updateAppUserEmail(id, dto);
        return ResponseEntity.ok(appUserDto);
    }

    @PatchMapping("/password/{id}")
    public ResponseEntity<Void> updateAppUserPassword(@PathVariable String id, @Valid @RequestBody UpdateAppUserPasswordRequest dto) throws Auth0Exception {
        logger.info("Inside: AppUserController -> updateAppUserPassword()...");
        service.updateAppUserPassword(id, dto);
        return ResponseEntity.noContent().build();
    }

    /*
    To send data from the frontend you need to send dto as FormData, example: https://github.com/piotrd22/portalY/blob/main/frontend/src/services/userService.js
    */
    @PatchMapping("/avatar/{id}")
    public ResponseEntity<AppUserDto> updateAppUserAvatar(@PathVariable String id, UpdateAppUserAvatarRequest dto) throws Auth0Exception {
        logger.info("Inside: AppUserController -> updateAppUserAvatar()...");
        if (!FileValidator.isImage(dto.file())) {
            throw new BadRequestException("File must be an image.");
        }
        AppUserDto appUserDto = service.updateAppUserAvatar(id, dto);
        return ResponseEntity.ok(appUserDto);
    }

    /*
    ADMIN ENDPOINT
     */
    @PatchMapping("/approve/{id}")
    public ResponseEntity<AppUserDto> approveAppUser(@PathVariable String id, @Valid @RequestBody ApproveAppUserRequest dto) {
        logger.info("Inside: AppUserController -> approveAppUser()...");
        AppUserDto appUserDto = service.approveAppUser(id, dto);
        return ResponseEntity.ok(appUserDto);
    }

    /*
    When we block a user, of course it will be blocked in Auth0, but the local session will still be maintained,
    so after blocking the user we should log him out so that his token expires.

    ADMIN ENDPOINT
     */
    @PatchMapping("/block/{id}")
    public ResponseEntity<AppUserDto> blockAppUser(@PathVariable String id, @Valid @RequestBody BlockAppUserRequest dto) throws Auth0Exception {
        logger.info("Inside: AppUserController -> blockAppUser()...");
        AppUserDto appUserDto = service.blockAppUser(id, dto);
        return ResponseEntity.ok(appUserDto);
    }
}
