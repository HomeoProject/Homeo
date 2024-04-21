package it.homeo.userservice.mappers;

import it.homeo.userservice.config.CloudinaryProperties;
import it.homeo.userservice.dtos.response.AppUserDto;
import it.homeo.userservice.dtos.request.UpdateAppUserRequest;
import it.homeo.userservice.models.AppUser;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;


/*
Setting componentModel = "spring" in a MapStruct interface means that
MapStruct will generate an implementation class for the interface as a Spring-managed component (typically a Spring Bean).
This allows you to easily inject and use the mapping in other Spring components.
*/
@Mapper(componentModel = "spring")
public abstract class AppUserMapper {

    @Autowired
    private CloudinaryProperties cloudinaryProperties;

    public abstract AppUser updateAppUserRequestToAppUser(UpdateAppUserRequest updateAppUserRequest, @MappingTarget AppUser appUser);

    public AppUserDto appUserToAppUserDto(AppUser appUser) {
        if (appUser == null) {
            return null;
        }

        if (appUser.isDeleted() || appUser.isBlocked()) {
            return AppUserDto.builder()
                    .id(appUser.getId())
                    .firstName("Anonymous")
                    .lastName("Anonymous")
                    .avatar(cloudinaryProperties.getDefaultAvatar())
                    .isDeleted(appUser.isDeleted())
                    .isBlocked(appUser.isBlocked())
                    .isOnline(appUser.isOnline())
                    .lastOnlineAt(appUser.getLastOnlineAt())
                    .createdAt(appUser.getCreatedAt())
                    .build();
        }

        return AppUserDto.builder()
                .id(appUser.getId())
                .firstName(appUser.getFirstName())
                .lastName(appUser.getLastName())
                .phoneNumber(appUser.getPhoneNumber())
                .email(appUser.getEmail())
                .avatar(appUser.getAvatar())
                .isBlocked(appUser.isBlocked())
                .isOnline(appUser.isOnline())
                .lastOnlineAt(appUser.getLastOnlineAt())
                .isApproved(appUser.isApproved())
                .isDeleted(appUser.isDeleted())
                .createdAt(appUser.getCreatedAt())
                .updatedAt(appUser.getUpdatedAt())
                .build();
    }
}
