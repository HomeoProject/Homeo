package it.homeo.userservice.services;

import com.auth0.client.mgmt.ManagementAPI;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import it.homeo.userservice.dtos.*;
import it.homeo.userservice.exceptions.AppUserNotFoundException;
import it.homeo.userservice.exceptions.ForbiddenException;
import it.homeo.userservice.mappers.AppUserMapper;
import it.homeo.userservice.models.AppUser;
import it.homeo.userservice.repositories.AppUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AppUserService implements IAppUserService {
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

    public AppUserDto checkAppUserAfterLogin(CheckAppUserAfterLoginRequest dto) throws Auth0Exception {
        compareAppUserIdWithTokenId(dto.id());

        Optional<AppUser> optionalAppUser = repository.findById(dto.id());

        // If the user does not exist in the database, it means that he is logging in for the first time, so we create him and return it nicely :)
        if (optionalAppUser.isEmpty()) {
            AppUser newAppUser = mapper.checkAppUserAfterLoginRequestToAppUser(dto);
            AppUser savedAppUser = repository.save(newAppUser);
            return mapper.appUserToAppUserDto(savedAppUser);
        }


        // If it exists in the database, we check whether there are any inaccuracies between the Auth0 database and ours, possibly update the user and return dto
        AppUser appUser = optionalAppUser.get();
        User auth0User = mgmt.users().get(dto.id(), new UserFilter()).execute().getBody();

        boolean shouldSave = false;

        if (!appUser.getEmail().equals(auth0User.getEmail())) {
            appUser.setEmail(auth0User.getEmail());
            shouldSave = true;
        }

        if (!appUser.getAvatar().equals(auth0User.getPicture())) {
            appUser.setAvatar(auth0User.getPicture());
            shouldSave = true;
        }

        if (appUser.isBlocked() != auth0User.isBlocked()) {
            appUser.setBlocked(auth0User.isBlocked());
            shouldSave = true;
        }

        if (shouldSave) {
            repository.save(appUser);
        }

        return mapper.appUserToAppUserDto(appUser);
    }

    public AppUserDto updateAppUser(String id, UpdateAppUserRequest dto) {
        compareAppUserIdWithTokenId(id);

        AppUser appUser = repository.findById(id).orElseThrow(() -> new AppUserNotFoundException(id));
        appUser = mapper.updateAppUserRequestToAppUser(dto, appUser);
        appUser = repository.save(appUser);
        return mapper.appUserToAppUserDto(appUser);
    }

    public void deleteAppUser(String id) throws Auth0Exception {
        compareAppUserIdWithTokenId(id);

        AppUser appUser = repository.findById(id).orElseThrow(() -> new AppUserNotFoundException(id));

        // Auth0 DB update
        mgmt.users().delete(id).execute();

        // Local DB update
        repository.delete(appUser);
    }

    public AppUserDto updateAppUserIsConstructor(String id, UpdateAppUserIsConstructorRequest dto) {
        compareAppUserIdWithTokenId(id);

        AppUser appUser = repository.findById(id).orElseThrow(() -> new AppUserNotFoundException(id));

        // Local DB update
        appUser.setConstructor(dto.isConstructor());
        repository.save(appUser);

        return mapper.appUserToAppUserDto(appUser);
    }

    public AppUserDto updateAppUserEmail(String id, UpdateAppUserEmailRequest dto) throws Auth0Exception {
        compareAppUserIdWithTokenId(id);

        AppUser appUser = repository.findById(id).orElseThrow(() -> new AppUserNotFoundException(id));

        // Auth0 DB update
        User updatedUser = new User();
        updatedUser.setEmail(dto.email());
        mgmt.users().update(id, updatedUser).execute().getBody();

        // Local DB update
        appUser.setEmail(dto.email());
        repository.save(appUser);

        // TODO Resend email verification email

        return mapper.appUserToAppUserDto(appUser);
    }

    public void updateAppUserPassword(String id, UpdateAppUserPasswordRequest dto) throws Auth0Exception {
        compareAppUserIdWithTokenId(id);

        // Auth0 DB update
        User updatedUser = new User();
        updatedUser.setPassword(dto.password().toCharArray());
        mgmt.users().update(id, updatedUser).execute();
    }

    public AppUserDto approveAppUser(String id, ApproveAppUserRequest dto) {
        AppUser appUser = repository.findById(id).orElseThrow(() -> new AppUserNotFoundException(id));

        appUser.setApproved(dto.isApproved());
        repository.save(appUser);

        return mapper.appUserToAppUserDto(appUser);
    }

    public AppUserDto blockAppUser(String id, BlockAppUserRequest dto) throws Auth0Exception {
        AppUser appUser = repository.findById(id).orElseThrow(() -> new AppUserNotFoundException(id));

        // Auth0 DB update
        User updatedUser = new User();
        updatedUser.setBlocked(dto.isBlocked());
        mgmt.users().update(id, updatedUser).execute();

        // Local DB update
        appUser.setBlocked(dto.isBlocked());
        repository.save(appUser);

        return mapper.appUserToAppUserDto(appUser);
    }

    private void compareAppUserIdWithTokenId(String appUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String tokenId = authentication.getName();

        if (!appUserId.equals(tokenId)) {
            throw new ForbiddenException();
        }
    }
}
