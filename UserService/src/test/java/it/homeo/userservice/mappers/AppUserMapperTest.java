package it.homeo.userservice.mappers;

import it.homeo.userservice.dtos.response.AppUserDto;
import it.homeo.userservice.dtos.request.UpdateAppUserRequest;
import it.homeo.userservice.models.AppUser;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Date;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class AppUserMapperTest {
    private final AppUserMapper mapper = Mappers.getMapper(AppUserMapper.class);

    @Test
    void shouldMapAppUserToNullAppUserDto() {
        AppUserDto appUserDto = mapper.appUserToAppUserDto(null);
        assertThat(appUserDto).isNull();
    }

    @Test
    void shouldMapAppUserToAppUserDto() {
        AppUser appUser = createSampleUser();

        AppUserDto appUserDto = mapper.appUserToAppUserDto(appUser);

        assertThat(appUserDto).isNotNull();
        assertThat(appUserDto.id()).isEqualTo(appUser.getId());
        assertThat(appUserDto.firstName()).isEqualTo(appUser.getFirstName());
        assertThat(appUserDto.lastName()).isEqualTo(appUser.getLastName());
        assertThat(appUserDto.email()).isEqualTo(appUser.getEmail());
        assertThat(appUserDto.phoneNumber()).isEqualTo(appUser.getPhoneNumber());
        assertThat(appUserDto.avatar()).isEqualTo(appUser.getAvatar());
        assertThat(appUserDto.isBlocked()).isEqualTo(appUser.isBlocked());
        assertThat(appUserDto.isOnline()).isEqualTo(appUser.isOnline());
        assertThat(appUserDto.isApproved()).isEqualTo(appUser.isApproved());
        assertThat(appUserDto.createdAt()).isEqualTo(appUser.getCreatedAt());
        assertThat(appUserDto.updatedAt()).isEqualTo(appUser.getUpdatedAt());
    }

    @Test
    void shouldMapUpdateAppUserRequestToAppUser() {
        AppUser appUser = createSampleUser();

        UpdateAppUserRequest request = UpdateAppUserRequest.builder()
                .firstName("Jane")
                .lastName("Dae")
                .phoneNumber("987-654-321")
                .build();

        AppUser appUserMapped = mapper.updateAppUserRequestToAppUser(request, appUser);

        assertThat(appUserMapped).isNotNull();
        assertThat(appUserMapped.getId()).isEqualTo(appUser.getId());
        assertThat(appUserMapped.getFirstName()).isEqualTo(request.firstName());
        assertThat(appUserMapped.getLastName()).isEqualTo(request.lastName());
        assertThat(appUserMapped.getEmail()).isEqualTo(appUser.getEmail());
        assertThat(appUserMapped.getPhoneNumber()).isEqualTo(request.phoneNumber());
        assertThat(appUserMapped.getAvatar()).isEqualTo(appUser.getAvatar());
        assertThat(appUserMapped.isBlocked()).isFalse();
        assertThat(appUserMapped.getCreatedAt()).isNotNull();
        assertThat(appUserMapped.getUpdatedAt()).isNotNull();
    }

    private AppUser createSampleUser() {
        AppUser appUser = new AppUser();
        appUser.setId("auth|user1");
        appUser.setFirstName("John");
        appUser.setLastName("Doe");
        appUser.setEmail("john.doe@example.com");
        appUser.setPhoneNumber("123-456-789");
        appUser.setAvatar("avatar-url");
        appUser.setBlocked(false);
        appUser.setOnline(true);
        appUser.setApproved(true);
        appUser.setCreatedAt(new Date());
        appUser.setUpdatedAt(new Date());
        return appUser;
    }

    private Set<String> generateAuthorities() {
        return Set.of("admin:permission");
    }
}
