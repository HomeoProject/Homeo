package it.homeo.categoryservice.repositories;

import it.homeo.categoryservice.models.Category;
import it.homeo.categoryservice.models.CategoryUser;
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

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CategoryUserRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest");

    @Autowired
    CategoryUserRepository underTest;

    @Autowired
    CategoryRepository categoryRepository;

    private CategoryUser categoryUser1;
    private CategoryUser categoryUser2;
    private CategoryUser categoryUser3;

    @BeforeEach
    void setUp() {
        categoryUser1 = new CategoryUser();
        categoryUser2 = new CategoryUser();
        categoryUser3 = new CategoryUser();

        Category category1 = new Category();
        category1.setId(1L);
        categoryRepository.save(category1);

        Category category2 = new Category();
        category2.setId(2L);
        categoryRepository.save(category2);

        Category category3 = new Category();
        category3.setId(3L);
        categoryRepository.save(category3);

        categoryUser1.setCategory(category1);
        categoryUser1.setUserId("user1");

        categoryUser2.setCategory(category2);
        categoryUser2.setUserId("user2");

        categoryUser3.setCategory(category3);
        categoryUser3.setUserId("user3");
        underTest.saveAll(List.of(categoryUser1, categoryUser2, categoryUser3));
    }

    @AfterEach
    void tearDown() {
        underTest.deleteAll();
        categoryRepository.deleteAll();
    }

    @Test
    void connectionEstablished() {
        assertThat(postgres.isCreated()).isTrue();
        assertThat(postgres.isRunning()).isTrue();
    }

    @Test
    void shouldExistsCategoryUserByCategoryAndUserId() {
        Boolean exists1 = underTest.existsCategoryUserByCategoryAndUserId(categoryUser1.getCategory(), categoryUser1.getUserId());
        Boolean exists2 = underTest.existsCategoryUserByCategoryAndUserId(categoryUser2.getCategory(), categoryUser2.getUserId());
        Boolean exists3 = underTest.existsCategoryUserByCategoryAndUserId(categoryUser3.getCategory(), categoryUser3.getUserId());

        assertThat(exists1).isTrue();
        assertThat(exists2).isTrue();
        assertThat(exists3).isTrue();
    }

    @Test
    void shouldNotExistsCategoryUserByCategoryAndUserId() {
        Category nonExistingCategory = new Category();
        nonExistingCategory.setId(-1L);

        Boolean exists = underTest.existsCategoryUserByCategoryAndUserId(nonExistingCategory, "nonExistingUser");
        assertThat(exists).isFalse();
    }

    @Test
    void shouldFindByCategoryAndUserId() {
        Optional<CategoryUser> foundCategoryUser1 = underTest.findByCategoryAndUserId(categoryUser1.getCategory(), categoryUser1.getUserId());
        Optional<CategoryUser> foundCategoryUser2 = underTest.findByCategoryAndUserId(categoryUser2.getCategory(), categoryUser2.getUserId());
        Optional<CategoryUser> foundCategoryUser3 = underTest.findByCategoryAndUserId(categoryUser3.getCategory(), categoryUser3.getUserId());

        assertThat(foundCategoryUser1).isPresent().containsSame(categoryUser1);
        assertThat(foundCategoryUser2).isPresent().containsSame(categoryUser2);
        assertThat(foundCategoryUser3).isPresent().containsSame(categoryUser3);
    }

    @Test
    void shouldNotFindByCategoryAndUserId() {
        Category nonExistingCategory = new Category();
        nonExistingCategory.setId(-1L);

        Optional<CategoryUser> notFoundCategoryUser = underTest.findByCategoryAndUserId(nonExistingCategory, "nonExistingUser");
        assertThat(notFoundCategoryUser).isEmpty();
    }


    @Test
    void shouldDeleteAllByUserId() {
        String userId = categoryUser1.getUserId();
        underTest.deleteAllByUserId(userId);

        List<CategoryUser> remainingCategoryUsers = underTest.findAll();
        assertThat(remainingCategoryUsers.get(0).getCreatedAt()).isNotNull();
        assertThat(remainingCategoryUsers).doesNotContain(categoryUser1);
        assertThat(remainingCategoryUsers).contains(categoryUser2, categoryUser3);
    }

    @Test
    void shouldFindByUserId() {
        String userId = categoryUser1.getUserId();
        Long id = 10L;
        Category category1 = new Category();
        category1.setId(id);
        categoryRepository.save(category1);

        CategoryUser categoryUser = new CategoryUser();
        categoryUser.setCategory(category1);
        categoryUser.setUserId(userId);

        underTest.save(categoryUser);

        List<CategoryUser> foundCategoryUsers = underTest.findByUserId("user1");

        assertThat(foundCategoryUsers).hasSize(2);
    }

    @Test
    void shouldNotFindByUserId() {
        List<CategoryUser> foundCategoryUsers = underTest.findByUserId("nonExistingUser");

        assertThat(foundCategoryUsers).isEmpty();
    }
}
