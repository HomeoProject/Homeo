package it.homeo.userservice.services;

import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.client.mgmt.filter.UserFilter;
import it.homeo.userservice.dtos.AppUserDto;
import it.homeo.userservice.exceptions.AppUserNotFoundException;
import it.homeo.userservice.mappers.AppUserMapper;
import it.homeo.userservice.models.AppUser;
import it.homeo.userservice.repositories.AppUserRepository;
import org.springframework.stereotype.Service;

@Service
public class AppUserService {
    private final ManagementAPI mgmt;
    private final AppUserRepository repository;
    private final AppUserMapper mapper;

    public AppUserService(
            ManagementAPI mgmt,
            AppUserRepository repository,
            AppUserMapper mapper
    ) {
        this.mgmt = mgmt;
        this.repository = repository;
        this.mapper = mapper;
    }

    public AppUserDto getAppUserById(String id) {
        AppUser appUser = repository.findById(id).orElseThrow(() -> new AppUserNotFoundException(id));
        return mapper.appUserToAppUserDto(appUser);
    }
}
