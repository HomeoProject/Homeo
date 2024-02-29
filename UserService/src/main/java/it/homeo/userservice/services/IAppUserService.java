package it.homeo.userservice.services;

import com.auth0.exception.Auth0Exception;
import it.homeo.userservice.dtos.*;

public interface IAppUserService {
    AppUserDto getAppUserById(String id);
    AppUserDto checkAppUserAfterLogin(CheckAppUserAfterLoginRequest dto) throws Auth0Exception;
    AppUserDto updateAppUser(String id, UpdateAppUserRequest dto);
    AppUserDto updateAppUserEmail(String id, UpdateAppUserEmailRequest dto) throws Auth0Exception;
    AppUserDto approveAppUser(String id, ApproveAppUserRequest dto);
    AppUserDto blockAppUser(String id, BlockAppUserRequest dto) throws Auth0Exception;
    void deleteAppUser(String id) throws Auth0Exception;
    void updateAppUserIsConstructor(String id, UpdateAppUserIsConstructorRequest dto) throws Auth0Exception;
    void updateAppUserPassword(String id, UpdateAppUserPasswordRequest dto) throws Auth0Exception;
}
