package it.homeo.userservice.services;

import com.auth0.client.mgmt.ManagementAPI;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import it.homeo.userservice.config.Auth0RolesProperties;
import it.homeo.userservice.config.CloudinaryProperties;
import it.homeo.userservice.dtos.request.*;
import it.homeo.userservice.dtos.response.AppUserDto;
import it.homeo.userservice.dtos.response.CloudinaryDto;
import it.homeo.userservice.exceptions.AppUserNotFoundException;
import it.homeo.userservice.exceptions.ForbiddenException;
import it.homeo.userservice.mappers.AppUserMapper;
import it.homeo.userservice.messaging.AppUserEventProducer;
import it.homeo.userservice.models.AppUser;
import it.homeo.userservice.repositories.AppUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AppUserServiceImpl implements AppUserService {

    private final ManagementAPI mgmt;
    private final AppUserRepository repository;
    private final AppUserMapper mapper;
    private final CloudinaryService cloudinaryService;
    private final CloudinaryProperties cloudinaryProperties;
    private final AppUserEventProducer appUserEventProducer;
    private final Auth0RolesProperties auth0RolesProperties;

    public AppUserServiceImpl(
            ManagementAPI mgmt,
            AppUserRepository repository,
            AppUserMapper mapper,
            CloudinaryService cloudinaryService,
            CloudinaryProperties cloudinaryProperties,
            AppUserEventProducer appUserEventProducer,
            Auth0RolesProperties auth0RolesProperties
    ) {
        this.mgmt = mgmt;
        this.repository = repository;
        this.mapper = mapper;
        this.cloudinaryService = cloudinaryService;
        this.cloudinaryProperties = cloudinaryProperties;
        this.appUserEventProducer = appUserEventProducer;
        this.auth0RolesProperties = auth0RolesProperties;
    }

    public AppUserDto getAppUserById(String id) {
        AppUser appUser = getAppUser(id);
        return mapper.appUserToAppUserDto(appUser);
    }

    @Transactional
    public AppUserDto syncAppUserAfterLogin(String id) throws Auth0Exception {
        User auth0User = mgmt.users()
                .get(id, new UserFilter())
                .execute()
                .getBody();

        Optional<AppUser> optionalAppUser = repository.findById(id);

        boolean isAuth0UserBlocked = Boolean.TRUE.equals(auth0User.isBlocked()); // Handles null as false

        // If the user does not exist in the database, it means that he is logging in for the first time, so we create him and return it nicely :)
        if (optionalAppUser.isEmpty()) {
            AppUser newAppUser = synchronizeAppUserWithAuth0UserAfterFirstLogin(id, auth0User, isAuth0UserBlocked);
            return mapper.appUserToAppUserDto(newAppUser);
        }

        // If it exists in the database, we check whether there are any inaccuracies between the Auth0 database and ours, possibly update the user and return dto
        AppUser appUser = synchronizeAppUserWithAuth0User(optionalAppUser.get(), auth0User, isAuth0UserBlocked);
        return mapper.appUserToAppUserDto(appUser);
    }

    public AppUserDto updateAppUser(String id, UpdateAppUserRequest dto) throws Auth0Exception {
        compareAppUserIdWithTokenId(id);
        AppUser appUser = getAppUser(id);
        appUser = mapper.updateAppUserRequestToAppUser(dto, appUser);
        mgmt.users().addRoles(appUser.getId(), Collections.singletonList(auth0RolesProperties.getUserRoleId())).execute();
        appUser = repository.save(appUser);
        AppUserDto appUserDto = mapper.appUserToAppUserDto(appUser);
        if (isUserConstructor()) {
            appUserEventProducer.produceUserUpdatedEvent(appUserDto);
        }
        return appUserDto;
    }

    @Transactional
    public void deleteAppUser(String id) throws Auth0Exception {
        compareAppUserIdWithTokenId(id);
        AppUser appUser = getAppUser(id);

        // Delete avatar
        if (appUser.getAvatarId() != null) {
            cloudinaryService.deleteFile(appUser.getAvatarId());
            appUser.setAvatarId(null);
        }

        // Auth0 DB update
        mgmt.users().delete(id).execute();

        // Local DB update
        appUser.setAvatar(cloudinaryProperties.getDefaultAvatar());
        appUser.setDeleted(true);
        if (isUserConstructor()) {
            appUserEventProducer.produceUserDeletedEvents(appUser.getId());
        }
        repository.save(appUser);
    }

    @Transactional
    public AppUserDto updateAppUserEmail(String id, UpdateAppUserEmailRequest dto) throws Auth0Exception {
        compareAppUserIdWithTokenId(id);
        AppUser appUser = getAppUser(id);

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

    @Transactional
    public void updateAppUserPassword(String id, UpdateAppUserPasswordRequest dto) throws Auth0Exception {
        compareAppUserIdWithTokenId(id);

        // Auth0 DB update
        User updatedUser = new User();
        updatedUser.setPassword(dto.password().toCharArray());
        mgmt.users().update(id, updatedUser).execute();
    }

    public AppUserDto approveAppUser(String id, ApproveAppUserRequest dto) {
        AppUser appUser = getAppUser(id);
        appUser.setApproved(dto.isApproved());
        repository.save(appUser);
        return mapper.appUserToAppUserDto(appUser);
    }

    @Transactional
    public AppUserDto blockAppUser(String id, BlockAppUserRequest dto) throws Auth0Exception {
        AppUser appUser = getAppUser(id);

        if (appUser.isBlocked() == dto.isBlocked()) {
            return mapper.appUserToAppUserDto(appUser);
        }

        // Auth0 DB update
        User updatedUser = new User();
        updatedUser.setBlocked(dto.isBlocked());
        mgmt.users().update(id, updatedUser).execute();

        // Local DB update
        appUser.setBlocked(dto.isBlocked());
        repository.save(appUser);

        AppUserDto appUserDto = mapper.appUserToAppUserDto(appUser);
        appUserEventProducer.produceUserIsBlockedEvent(appUserDto);
        return appUserDto;
    }

    @Transactional
    public AppUserDto updateAppUserAvatar(String id, UpdateAppUserAvatarRequest dto) throws Auth0Exception {
        compareAppUserIdWithTokenId(id);
        AppUser appUser = getAppUser(id);

        if (appUser.getAvatarId() != null) {
            cloudinaryService.deleteFile(appUser.getAvatarId());
        }

        CloudinaryDto cloudinaryDto = cloudinaryService.uploadFile(dto.file());

        // Auth0 update
        User updatedUser = new User();
        updatedUser.setPicture(cloudinaryDto.imageUrl());
        mgmt.users().update(id, updatedUser).execute();

        // Local DB update
        appUser.setAvatarId(cloudinaryDto.publicId());
        appUser.setAvatar(cloudinaryDto.imageUrl());
        appUser = repository.save(appUser);

        return mapper.appUserToAppUserDto(appUser);
    }

    @Transactional
    public AppUserDto deleteAppUserAvatar(String id) throws Auth0Exception {
        compareAppUserIdWithTokenId(id);
        AppUser appUser = getAppUser(id);

        // Cloudinary delete
        if (appUser.getAvatarId() != null) {
            cloudinaryService.deleteFile(appUser.getAvatarId());
            appUser.setAvatarId(null);
        }

        // Auth0 update
        User updatedUser = new User();
        updatedUser.setPicture(cloudinaryProperties.getDefaultAvatar());
        mgmt.users().update(id, updatedUser).execute();

        // Local DB update
        appUser.setAvatar(cloudinaryProperties.getDefaultAvatar());
        appUser = repository.save(appUser);

        return mapper.appUserToAppUserDto(appUser);
    }

    private AppUser synchronizeAppUserWithAuth0User(AppUser appUser, User auth0User, boolean isAuth0UserBlocked) {
        boolean shouldSave = false;

        if (!appUser.getEmail().equals(auth0User.getEmail())) {
            appUser.setEmail(auth0User.getEmail());
            shouldSave = true;
        }

        if (!appUser.getAvatar().equals(auth0User.getPicture())) {
            appUser.setAvatar(auth0User.getPicture());
            shouldSave = true;
        }

        if (appUser.isBlocked() != isAuth0UserBlocked) {
            appUser.setBlocked(isAuth0UserBlocked);
            shouldSave = true;
        }

        if (shouldSave) {
            repository.save(appUser);
        }

        return appUser;
    }

    private AppUser synchronizeAppUserWithAuth0UserAfterFirstLogin(String id, User auth0User, boolean isAuth0UserBlocked) throws Auth0Exception {
        User updatedUser = new User();
        updatedUser.setPicture(cloudinaryProperties.getDefaultAvatar());
        mgmt.users().update(id, updatedUser).execute();

        AppUser newAppUser = new AppUser();
        newAppUser.setId(auth0User.getId());
        newAppUser.setEmail(auth0User.getEmail());
        newAppUser.setAvatar(cloudinaryProperties.getDefaultAvatar());
        newAppUser.setBlocked(isAuth0UserBlocked);
        return repository.save(newAppUser);
    }

    private AppUser getAppUser(String id) {
        return repository.findById(id).orElseThrow(() -> new AppUserNotFoundException(id));
    }

    private void compareAppUserIdWithTokenId(String appUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String tokenId = authentication.getName();

        if (!appUserId.equals(tokenId)) {
            throw new ForbiddenException();
        }
    }

    private boolean isUserConstructor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        return authorities.stream()
                .anyMatch(authority -> authority.getAuthority().equals("constructor:permission"));
    }
}
