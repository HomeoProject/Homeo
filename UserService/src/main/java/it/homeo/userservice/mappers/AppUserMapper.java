package it.homeo.userservice.mappers;

import it.homeo.userservice.dtos.response.AppUserDto;
import it.homeo.userservice.dtos.request.UpdateAppUserRequest;
import it.homeo.userservice.models.AppUser;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;


/*
Setting componentModel = "spring" in a MapStruct interface means that
MapStruct will generate an implementation class for the interface as a Spring-managed component (typically a Spring Bean).
This allows you to easily inject and use the mapping in other Spring components.
*/
@Mapper(componentModel = "spring")
public interface AppUserMapper {

    AppUser updateAppUserRequestToAppUser(UpdateAppUserRequest updateAppUserRequest, @MappingTarget AppUser appUser);

    default AppUserDto appUserToAppUserDto(AppUser appUser) {
        if (appUser.isDeleted()) {
            return AppUserDto.builder()
                    .id(appUser.getId())
                    .firstName("Anonymous")
                    .lastName("Anonymous")
                    .avatar(appUser.getAvatar())
                    .isDeleted(appUser.isDeleted())
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
                .isApproved(appUser.isApproved())
                .isDeleted(appUser.isDeleted())
                .createdAt(appUser.getCreatedAt())
                .updatedAt(appUser.getUpdatedAt())
                .build();
    }
}
