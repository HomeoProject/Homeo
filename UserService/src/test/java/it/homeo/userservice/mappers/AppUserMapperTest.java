package it.homeo.userservice.mappers;

import it.homeo.userservice.dtos.AppUserDto;
import it.homeo.userservice.models.AppUser;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Date;

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
        appUser.setConstructor(true);
        appUser.setCreatedAt(new Date());
        appUser.setUpdatedAt(new Date());

        AppUserDto appUserDto = mapper.appUserToAppUserDto(appUser);

        assertThat(appUserDto).isNotNull();
        assertThat(appUserDto.getId()).isEqualTo(appUser.getId());
        assertThat(appUserDto.getFirstName()).isEqualTo(appUser.getFirstName());
        assertThat(appUserDto.getLastName()).isEqualTo(appUser.getLastName());
        assertThat(appUserDto.getEmail()).isEqualTo(appUser.getEmail());
        assertThat(appUserDto.getPhoneNumber()).isEqualTo(appUser.getPhoneNumber());
        assertThat(appUserDto.getAvatar()).isEqualTo(appUser.getAvatar());
        assertThat(appUserDto.isBlocked()).isEqualTo(appUser.isBlocked());
        assertThat(appUserDto.isOnline()).isEqualTo(appUser.isOnline());
        assertThat(appUserDto.isApproved()).isEqualTo(appUser.isApproved());
        assertThat(appUserDto.isConstructor()).isEqualTo(appUser.isConstructor());
        assertThat(appUserDto.getCreatedAt()).isEqualTo(appUser.getCreatedAt());
        assertThat(appUserDto.getUpdatedAt()).isEqualTo(appUser.getUpdatedAt());
    }
}
