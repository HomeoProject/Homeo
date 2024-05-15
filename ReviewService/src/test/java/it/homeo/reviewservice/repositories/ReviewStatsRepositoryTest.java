package it.homeo.reviewservice.repositories;

import it.homeo.reviewservice.models.ReviewStats;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ReviewStatsRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest");

    @Autowired
    private ReviewStatsRepository underTest;

    private static final String USER_ID = "userId";

    @BeforeEach
    void setUp() {
        ReviewStats reviewStats = new ReviewStats();
        reviewStats.setUserId(USER_ID);
        reviewStats.setReviewsNumber(10);
        reviewStats.setRatingsSum(40.50);
        underTest.save(reviewStats);
    }

    @AfterEach
    void tearDown() {
        underTest.deleteAll();
    }

    @Test
    void connectionEstablished() {
        assertThat(postgres.isCreated()).isTrue();
        assertThat(postgres.isRunning()).isTrue();
    }

    @Test
    @DisplayName("Should find review stats by user id")
    void testFindByUserId() {
        Optional<ReviewStats> foundReviewStats = underTest.findByUserId(USER_ID);
        assertThat(foundReviewStats).isPresent();
        assertThat(foundReviewStats.get().getUserId()).isEqualTo(USER_ID);
    }

    @Test
    @DisplayName("Should delete review stats by user id")
    void testDeleteByUserId() {
        underTest.deleteByUserId(USER_ID);
        Optional<ReviewStats> deletedReviewStats = underTest.findByUserId(USER_ID);
        assertThat(deletedReviewStats).isEmpty();
    }
}
