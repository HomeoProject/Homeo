package it.homeo.userservice.services;

import it.homeo.userservice.dtos.AppUserDto;
import it.homeo.userservice.exceptions.AppUserNotFoundException;
import it.homeo.userservice.mappers.AppUserMapper;
import it.homeo.userservice.models.AppUser;
import it.homeo.userservice.repositories.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppUserServiceTest {
    @Mock
    private AppUserRepository repository;

    @Mock
    private AppUserMapper mapper;

    @InjectMocks
    private AppUserService underTest;

    @Captor
    private ArgumentCaptor<AppUser> appUserArgumentCaptor;

    @Test
    void shouldGetAppUserById() {
        String id = "auth|user1";

        AppUser appUser = new AppUser();
        appUser.setId(id);

        AppUserDto appUserDto = AppUserDto.builder()
                .id(id)
                .build();

        when(repository.findById(id)).thenReturn(Optional.of(appUser));
        when(mapper.appUserToAppUserDto(appUser)).thenReturn(appUserDto);

        underTest.getAppUserById(id);

        verify(repository).findById(eq(id));
        verify(mapper).appUserToAppUserDto(appUserArgumentCaptor.capture());

        AppUser capturedAppUser = appUserArgumentCaptor.getValue();
        assertThat(capturedAppUser).isEqualTo(appUser);
    }

    @Test
    void shouldGetAppUserByIdThrowException() {
        String id = "auth|user1";
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(AppUserNotFoundException.class, () -> underTest.getAppUserById(id));
        verify(repository).findById(eq(id));
    }
}
