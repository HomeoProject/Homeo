package it.homeo.categoryservice.repositories;

import it.homeo.categoryservice.models.Category;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CategoryRepositoryTest {
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest");

    @Autowired
    CategoryRepository repository;

    private Category category1;
    private Category category2;
    private Category category3;

    @BeforeEach
    void setUp() {
        category1 = new Category();
        category2 = new Category();
        category3 = new Category();
        category1.setName("ACategory");
        category2.setName("CCategory");
        category3.setName("BCategory");
        repository.saveAll(List.of(category1, category2, category3));
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
    void shouldExistsByNameIgnoreCase() {
        Boolean exists1 = repository.existsByNameIgnoreCase(category1.getName().toLowerCase());
        Boolean exists2 = repository.existsByNameIgnoreCase(category2.getName());
        Boolean exists3 = repository.existsByNameIgnoreCase(category3.getName().toUpperCase());

        assertThat(exists1).isTrue();
        assertThat(exists2).isTrue();
        assertThat(exists3).isTrue();
    }

    @Test
    void shouldNotExistsByNameIgnoreCase() {
        Boolean exists = repository.existsByNameIgnoreCase("Not existing category");
        assertThat(exists).isFalse();
    }

    @Test
    void shouldFindAllByOrderByNameAsc() {
        List<Category> categories = repository.findAllByOrderByNameAsc();
        assertThat(categories).isSortedAccordingTo(Comparator.comparing(Category::getName, String.CASE_INSENSITIVE_ORDER));
    }
}
