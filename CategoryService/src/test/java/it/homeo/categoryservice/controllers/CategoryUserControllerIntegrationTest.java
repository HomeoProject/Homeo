package it.homeo.categoryservice.controllers;

import it.homeo.categoryservice.dtos.AddUserToCategoryRequestDto;
import it.homeo.categoryservice.models.Category;
import it.homeo.categoryservice.models.CategoryUser;
import it.homeo.categoryservice.repositories.CategoryRepository;
import it.homeo.categoryservice.repositories.CategoryUserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;
import org.testcontainers.utility.DockerImageName;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@Testcontainers
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CategoryUserControllerIntegrationTest {
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest");

    @Container
    @ServiceConnection
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"));

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryUserRepository repository;

    @Autowired
    private CategoryRepository categoryRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private List<Category> categories;

    private List<CategoryUser> data;

    @BeforeEach
    void setUp() {
        categories = createSampleCategories();
        categories = categoryRepository.saveAll(categories);

        data = createSampleData();
        data = repository.saveAll(data);
    }

    @AfterEach
    void tearDown() {
        repository.deleteAll();
        categoryRepository.deleteAll();
    }

    @Test
    void connectionEstablished() {
        assertThat(postgres.isCreated()).isTrue();
        assertThat(postgres.isRunning()).isTrue();

        assertThat(kafka.isCreated()).isTrue();
        assertThat(kafka.isRunning()).isTrue();
    }

    @Test
    void shouldGetUserCategories() throws Exception {
        Long id = categories.get(0).getId();
        String userId = data.get(0).getUserId();
        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories/users", id)
                        .with(jwt()
                                .authorities(new SimpleGrantedAuthority("constructor:permission"))
                                .jwt((token) -> token.claim("sub", userId))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(id));
    }

    @Test
    void shouldGetUserCategoriesThrowsForbidden() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories/users")
                .with(jwt()))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldDeleteUserFromCategory() throws Exception {
        Long categoryId = categories.get(0).getId();
        String userId = data.get(0).getUserId();

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/categories/users/{id}", categoryId)
                        .with(jwt()
                                .authorities(new SimpleGrantedAuthority("constructor:permission"))
                                .jwt(token -> token.claim("sub", userId))))
                .andExpect(status().isNoContent());

        Boolean isDeleted = repository.existsCategoryUserByCategoryAndUserId(categories.get(0), userId);
        assertThat(isDeleted).isFalse();
    }

    @Test
    void shouldNotDeleteUserFromCategoryWhenNotAuthenticated() throws Exception {
        Long categoryId = categories.get(0).getId();

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/categories/users/{id}", categoryId))
                .andExpect(status().isForbidden());

        List<CategoryUser> categoryUsers = repository.findAll();
        assertThat(categoryUsers).hasSize(data.size());
    }

    @Test
    void shouldNotDeleteUserFromCategoryWithInvalidCategoryId() throws Exception {
        String userId = data.get(0).getUserId();
        Long invalidCategoryId = Long.MAX_VALUE;

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/categories/users/{id}", invalidCategoryId)
                        .with(jwt()
                                .authorities(new SimpleGrantedAuthority("constructor:permission"))
                                .jwt(token -> token.claim("sub", userId))))
                .andExpect(status().isNotFound());

        List<CategoryUser> categoryUsers = repository.findAll();
        assertThat(categoryUsers).hasSize(data.size());
    }

    @Test
    void shouldAddUserToCategory() throws Exception {
        Category category = new Category();
        category.setName("NewCategory");
        category.setCreatedBy("TestUser");
        category.setUpdatedBy("TestUser");
        category = categoryRepository.save(category);

        AddUserToCategoryRequestDto addUserDto = AddUserToCategoryRequestDto.builder()
                .categoryId(category.getId())
                .build();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/categories/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addUserDto))
                        .with(jwt().authorities(new SimpleGrantedAuthority("constructor:permission"))
                                .jwt(token -> token.claim("sub", "auth0|test-user"))))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value(category.getName()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(category.getId()));
    }

    @Test
    void shouldNotAddUserToCategoryWithInvalidCategoryId() throws Exception {
        AddUserToCategoryRequestDto addUserDto = AddUserToCategoryRequestDto.builder()
                .categoryId(Long.MAX_VALUE)
                .build();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/categories/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addUserDto))
                        .with(jwt().authorities(new SimpleGrantedAuthority("constructor:permission"))
                                .jwt(token -> token.claim("sub", "auth0|test-user"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldNotAddUserToCategoryWhenAlreadyExists() throws Exception {
        Category existingCategory = categories.get(0);
        String userId = data.get(0).getUserId();

        AddUserToCategoryRequestDto addUserDto = AddUserToCategoryRequestDto.builder()
                .categoryId(existingCategory.getId())
                .build();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/categories/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addUserDto))
                        .with(jwt().authorities(new SimpleGrantedAuthority("constructor:permission"))
                                .jwt(token -> token.claim("sub", userId))))
                .andExpect(status().isConflict());
    }

    @Test
    void shouldNotAddUserToCategoryWhenBadRequest() throws Exception {
        String userId = data.get(0).getUserId();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/categories/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(jwt().authorities(new SimpleGrantedAuthority("constructor:permission"))
                                .jwt(token -> token.claim("sub", userId))))
                .andExpect(status().isBadRequest());
    }

    private List<Category> createSampleCategories() {
        List<Category> categoryList = new ArrayList<>();

        for (int i = 0; i < 3; i++) {
            Category category = new Category();
            category.setName("Name" + i);
            category.setCreatedBy("CreatedBy" + i);
            category.setUpdatedBy("UpdatedBy" + i);

            categoryList.add(category);
        }

        return categoryList;
    }

    private List<CategoryUser> createSampleData() {
        List<CategoryUser> dataList = new ArrayList<>();

        for (Category category : categories) {
            CategoryUser categoryUser = new CategoryUser();
            categoryUser.setCategory(category);
            categoryUser.setUserId("auth0|" + category.getId());

            dataList.add(categoryUser);
        }

        return dataList;
    }
}
