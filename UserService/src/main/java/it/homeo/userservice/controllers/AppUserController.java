package it.homeo.userservice.controllers;

import com.auth0.exception.Auth0Exception;
import it.homeo.userservice.dtos.*;
import it.homeo.userservice.services.IAppUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

// TODO Avatar update with cloud provider
// TODO Event sourcing with Kafka to search service and isOnline event from notification service
// TODO Resend verification email after updating
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class AppUserController {
    private final IAppUserService service;

    public AppUserController(IAppUserService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public AppUserDto getAppUserById(@PathVariable String id) {
        return service.getAppUserById(id);
    }

    /*
    Endpoint that we should execute after logging in.
    It compares the data with auth0 and checks whether the user already exists in our database.
     */
    @PostMapping
    public AppUserDto checkAppUserAfterLogin(@Valid @RequestBody CheckAppUserAfterLoginRequest dto) throws Auth0Exception {
        return service.checkAppUserAfterLogin(dto);
    }

    /*
    Endpoint requires sending all DTO fields
    */
    @PutMapping("/{id}")
    public AppUserDto updateAppUser(@PathVariable String id, @Valid @RequestBody UpdateAppUserRequest dto) {
        return service.updateAppUser(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAppUser(@PathVariable String id) throws Auth0Exception {
        service.deleteAppUser(id);
    }

    @PatchMapping("/constructor/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateAppUserIsConstructor(@PathVariable String id, @Valid @RequestBody UpdateAppUserIsConstructorRequest dto) throws Auth0Exception {
        service.updateAppUserIsConstructor(id, dto);
    }

    @PatchMapping("/email/{id}")
    public AppUserDto updateAppUserEmail(@PathVariable String id, @Valid @RequestBody UpdateAppUserEmailRequest dto) throws Auth0Exception {
        return service.updateAppUserEmail(id, dto);
    }

    @PatchMapping("/password/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateAppUserPassword(@PathVariable String id, @Valid @RequestBody UpdateAppUserPasswordRequest dto) throws Auth0Exception {
        service.updateAppUserPassword(id, dto);
    }

    /*
    ADMIN ENDPOINT
     */
    @PatchMapping("/approve/{id}")
    public AppUserDto approveAppUser(@PathVariable String id, @Valid @RequestBody ApproveAppUserRequest dto) {
        return service.approveAppUser(id, dto);
    }

    /*
    When we block a user, of course it will be blocked in Auth0, but the local session will still be maintained,
    so after blocking the user we should log him out so that his token expires.

    ADMIN ENDPOINT
     */
    @PatchMapping("/block/{id}")
    public AppUserDto blockAppUser(@PathVariable String id, @Valid @RequestBody BlockAppUserRequest dto) throws Auth0Exception {
        return service.blockAppUser(id, dto);
    }
}
