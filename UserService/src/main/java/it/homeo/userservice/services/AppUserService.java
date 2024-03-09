package it.homeo.userservice.services;

import com.auth0.exception.Auth0Exception;
import it.homeo.userservice.dtos.request.*;
import it.homeo.userservice.dtos.response.AppUserDto;

public interface AppUserService {
    AppUserDto getAppUserById(String id);
    AppUserDto syncAppUserAfterLogin(String id) throws Auth0Exception;
    AppUserDto updateAppUser(String id, UpdateAppUserRequest dto) throws Auth0Exception;
    AppUserDto updateAppUserEmail(String id, UpdateAppUserEmailRequest dto) throws Auth0Exception;
    AppUserDto approveAppUser(String id, ApproveAppUserRequest dto);
    AppUserDto blockAppUser(String id, BlockAppUserRequest dto) throws Auth0Exception;
    AppUserDto updateAppUserAvatar(String id, UpdateAppUserAvatarRequest dto) throws Auth0Exception;
    AppUserDto deleteAppUserAvatar(String id) throws Auth0Exception;
    void deleteAppUser(String id) throws Auth0Exception;
    void updateAppUserPassword(String id, UpdateAppUserPasswordRequest dto) throws Auth0Exception;
}
