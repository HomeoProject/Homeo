package it.homeo.categoryservice.controllers;

import it.homeo.categoryservice.dtos.AddCategoryRequestDto;
import it.homeo.categoryservice.dtos.UpdateCategoryRequestDto;
import it.homeo.categoryservice.models.Category;
import it.homeo.categoryservice.repositories.CategoryRepository;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;
import org.testcontainers.utility.DockerImageName;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@Testcontainers
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class  CategoryControllerIntegrationTest {
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest");

    @Container
    @ServiceConnection
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"));

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepository repository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private List<Category> categories;

    @BeforeEach
    void setUp() {
        categories = createSampleCategories();
        categories = repository.saveAll(categories);
    }

    @AfterEach
    void tearDown() {
        repository.deleteAll();
    }

    @Test
    void connectionEstablished() {
        assertThat(postgres.isCreated()).isTrue();
        assertThat(postgres.isRunning()).isTrue();

        assertThat(kafka.isCreated()).isTrue();
        assertThat(kafka.isRunning()).isTrue();
    }

    @Test
    void shouldGetAllCategories() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$.length()").value(categories.size()));
    }

    @Test
    void shouldGetCategoryById() throws Exception {
        Long id = categories.get(0).getId();
        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id));
    }

    @Test
    void shouldGetCategoryByIdThrowCategoryNotFoundException() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories/-1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetCategoryByIdReturnBadRequest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories/badID"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldAddCategory() throws Exception {
        AddCategoryRequestDto requestDto = new AddCategoryRequestDto("NewCategory");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/categories")
                        .with(jwt().authorities(new SimpleGrantedAuthority("admin:permission")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated());

        List<Category> updatedCategories = repository.findAll();
        assertThat(updatedCategories.size()).isEqualTo(categories.size() + 1);
    }

    @Test
    void shouldAddCategoryReturnConflict() throws Exception {
        AddCategoryRequestDto requestDto = new AddCategoryRequestDto(categories.get(0).getName());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/categories")
                        .with(jwt().authorities(new SimpleGrantedAuthority("admin:permission")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isConflict());
    }

    @Test
    void shouldAddCategoryReturnBadRequest() throws Exception {
        AddCategoryRequestDto requestDto = AddCategoryRequestDto.builder().build();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/categories")
                        .with(jwt().authorities(new SimpleGrantedAuthority("admin:permission")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldAddCategoryReturnForbidden() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/categories"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldUpdateCategory() throws Exception {
        Long categoryId = categories.get(0).getId();
        UpdateCategoryRequestDto requestDto = new UpdateCategoryRequestDto("UpdatedCategory");

        mockMvc.perform(MockMvcRequestBuilders.put("/api/categories/{id}", categoryId)
                        .with(jwt().authorities(new SimpleGrantedAuthority("admin:permission")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk());

        Category updatedCategory = repository.findById(categoryId).orElse(null);
        assertThat(updatedCategory).isNotNull();
        assertThat(updatedCategory.getName()).isEqualTo(requestDto.name().toUpperCase());
    }

    @Test
    void shouldUpdateCategoryReturnNotFound() throws Exception {
        UpdateCategoryRequestDto requestDto = new UpdateCategoryRequestDto("UpdatedCategory");

        mockMvc.perform(MockMvcRequestBuilders.put("/api/categories/{id}", -1)
                        .with(jwt().authorities(new SimpleGrantedAuthority("admin:permission")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldUpdateCategoryReturnConflict() throws Exception {
        Long categoryId = categories.get(0).getId();
        UpdateCategoryRequestDto requestDto = new UpdateCategoryRequestDto(categories.get(0).getName());

        mockMvc.perform(MockMvcRequestBuilders.put("/api/categories/{id}", categoryId)
                        .with(jwt().authorities(new SimpleGrantedAuthority("admin:permission")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isConflict());
    }

    @Test
    void shouldUpdateCategoryReturnBadRequest() throws Exception {
        Long categoryId = categories.get(0).getId();
        UpdateCategoryRequestDto requestDto = UpdateCategoryRequestDto.builder().build();

        mockMvc.perform(MockMvcRequestBuilders.put("/api/categories/{id}", categoryId)
                        .with(jwt().authorities(new SimpleGrantedAuthority("admin:permission")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldUpdateCategoryReturnForbidden() throws Exception {
        Long categoryId = categories.get(0).getId();

        mockMvc.perform(MockMvcRequestBuilders.put("/api/categories/{id}", categoryId))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldDeleteCategory() throws Exception {
        Long categoryId = categories.get(0).getId();

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/categories/{id}", categoryId)
                        .with(jwt().authorities(new SimpleGrantedAuthority("admin:permission"))))
                .andExpect(status().isNoContent());

        Category deletedCategory = repository.findById(categoryId).orElse(null);
        assertThat(deletedCategory).isNull();
    }

    @Test
    void shouldDeleteCategoryReturnNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/categories/{id}", -1)
                        .with(jwt().authorities(new SimpleGrantedAuthority("admin:permission"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteCategoryReturnForbidden() throws Exception {
        Long categoryId = categories.get(0).getId();

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/categories/{id}", categoryId))
                .andExpect(status().isForbidden());
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
}
