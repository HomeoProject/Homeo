package it.homeo.userservice.controllers;


import it.homeo.userservice.dtos.AppUserDto;
import it.homeo.userservice.models.AppUser;
import it.homeo.userservice.repositories.AppUserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AppUserControllerIntegrationTest {
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest");

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private AppUserRepository repository;

    private List<AppUser> users;

    @BeforeEach
    void setUp() {
        createSampleUsers();
    }

    @AfterEach
    void tearDown() {
        repository.deleteAll();
    }

    @Test
    void connectionEstablished() {
        assertThat(postgres.isCreated()).isTrue();
        assertThat(postgres.isRunning()).isTrue();
    }

    @Test
    void shouldGetAppUserById() {
        String id = users.get(0).getId();
        ResponseEntity<AppUserDto> responseEntity = restTemplate.exchange("/api/users/{id}", HttpMethod.GET, null, AppUserDto.class, id);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().id()).isEqualTo(id);
        assertThat(responseEntity.getBody().createdAt()).isNotNull();
    }

    @Test
    void shouldNotFoundAppUserById() {
        ResponseEntity<AppUserDto> responseEntity = restTemplate.exchange("/api/users/-2", HttpMethod.GET, null, AppUserDto.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    private void createSampleUsers() {
        AppUser user1 = new AppUser();
        user1.setId("auth0|user1");
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setPhoneNumber("123456789");
        user1.setEmail("john.doe@example.com");
        user1.setAvatar("avatar1.jpg");
        user1.setBlocked(false);
        user1.setOnline(true);
        user1.setApproved(true);
        user1.setConstructor(false);

        AppUser user2 = new AppUser();
        user2.setId("auth0|user2");
        user2.setFirstName("Jane");
        user2.setLastName("Smith");
        user2.setPhoneNumber("987654321");
        user2.setEmail("jane.smith@example.com");
        user2.setAvatar("avatar2.jpg");
        user2.setBlocked(false);
        user2.setOnline(true);
        user2.setApproved(true);
        user2.setConstructor(false);

        AppUser user3 = new AppUser();
        user3.setId("auth0|user3");
        user3.setFirstName("Bob");
        user3.setLastName("Johnson");
        user3.setPhoneNumber("555555555");
        user3.setEmail("bob.johnson@example.com");
        user3.setAvatar("avatar3.jpg");
        user3.setBlocked(false);
        user3.setOnline(true);
        user3.setApproved(true);
        user3.setConstructor(false);

        users = repository.saveAll(List.of(user1, user2, user3));
    }
}
