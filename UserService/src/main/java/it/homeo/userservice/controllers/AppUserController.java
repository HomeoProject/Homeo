package it.homeo.userservice.controllers;

import it.homeo.userservice.dtos.AppUserDto;
import it.homeo.userservice.services.AppUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class AppUserController {
    private final AppUserService service;

    public AppUserController(AppUserService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public AppUserDto getAppUserById(@PathVariable String id) {
        return service.getAppUserById(id);
    }
}
