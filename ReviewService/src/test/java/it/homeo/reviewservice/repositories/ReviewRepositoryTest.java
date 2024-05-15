package it.homeo.reviewservice.repositories;

import it.homeo.reviewservice.models.Review;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ReviewRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest");

    @Autowired
    private ReviewRepository underTest;

    private static final String RECEIVER_ID = "receiverId";
    private static final String REVIEWER_ID = "reviewerId";
    private static final int PAGE_SIZE = 5;
    private List<Review> receiverReviews = new ArrayList<>();
    private List<Review> reviewerReviews = new ArrayList<>();

    @BeforeEach
    void setUp() {
        setUpReviews();
    }

    @AfterEach
    void tearDown() {
        underTest.deleteAll();
        receiverReviews = new ArrayList<>();
        reviewerReviews = new ArrayList<>();
    }

    @Test
    void connectionEstablished() {
        assertThat(postgres.isCreated()).isTrue();
        assertThat(postgres.isRunning()).isTrue();
    }

    @Test
    @DisplayName("Should find review by receiver id and reviewer id")
    void testFindByReceiverIdAndReviewerId() {
        Optional<Review> foundReview = underTest.findByReceiverIdAndReviewerId(RECEIVER_ID, REVIEWER_ID);
        assertThat(foundReview).isPresent();
        assertThat(foundReview.get().getReceiverId()).isEqualTo(RECEIVER_ID);
        assertThat(foundReview.get().getReviewerId()).isEqualTo(REVIEWER_ID);
    }

    @Test
    @DisplayName("Should delete all reviews by receiver id")
    void testDeleteAllByReceiverId() {
        underTest.deleteAllByReceiverId(RECEIVER_ID);
        List<Review> reviews = underTest.findAll();
        boolean hasNoReviewsForReceiverId = reviews.stream().noneMatch(review -> review.getReceiverId().equals(RECEIVER_ID));
        assertThat(hasNoReviewsForReceiverId).isTrue();
    }

    // Testing infinite scroll
    @Test
    @DisplayName("Should retrieve reviews created before given timestamp with receiver id")
    void testFindReviewByReceiverIdBeforeGivenCreatedAt() {
        Instant lastCreatedAt = Instant.now();
        Pageable pageable = PageRequest.of(0, PAGE_SIZE);

        List<Review> sortedReviews = receiverReviews.stream()
                .sorted(Comparator.comparing(Review::getCreatedAt).reversed())
                .toList();

        List<Review> foundReviews = underTest.findByReceiverIdAndCreatedAtBeforeOrderByCreatedAtDesc(RECEIVER_ID, lastCreatedAt, pageable);

        assertThat(foundReviews).isNotNull();
        assertThat(foundReviews).hasSizeLessThanOrEqualTo(PAGE_SIZE);
        assertThat(foundReviews).containsExactlyInAnyOrderElementsOf(sortedReviews.subList(0, foundReviews.size()));

        lastCreatedAt = foundReviews.get(foundReviews.size() - 1).getCreatedAt();
        int expectedRemainingSize = Math.min(PAGE_SIZE, sortedReviews.size() - PAGE_SIZE);

        foundReviews = underTest.findByReceiverIdAndCreatedAtBeforeOrderByCreatedAtDesc(RECEIVER_ID, lastCreatedAt, pageable);

        assertThat(foundReviews).isNotNull();
        assertThat(foundReviews).hasSizeLessThanOrEqualTo(expectedRemainingSize);
        assertThat(foundReviews).containsExactlyInAnyOrderElementsOf(sortedReviews.subList(PAGE_SIZE, PAGE_SIZE + foundReviews.size()));

        lastCreatedAt = foundReviews.get(foundReviews.size() - 1).getCreatedAt();
        expectedRemainingSize = Math.min(PAGE_SIZE, sortedReviews.size() - PAGE_SIZE - PAGE_SIZE);

        foundReviews = underTest.findByReceiverIdAndCreatedAtBeforeOrderByCreatedAtDesc(RECEIVER_ID, lastCreatedAt, pageable);

        assertThat(foundReviews).isNotNull();
        assertThat(foundReviews).hasSizeLessThanOrEqualTo(expectedRemainingSize);
        assertThat(foundReviews).containsExactlyInAnyOrderElementsOf(sortedReviews.subList(PAGE_SIZE + PAGE_SIZE, PAGE_SIZE + PAGE_SIZE + foundReviews.size()));
    }

    // Testing infinite scroll
    @Test
    @DisplayName("Should retrieve reviews created before given timestamp with reviewer id")
    void testFindReviewByReviewerIdBeforeGivenCreatedAt() {
        Instant lastCreatedAt = Instant.now();
        Pageable pageable = PageRequest.of(0, PAGE_SIZE);

        List<Review> sortedReviews = reviewerReviews.stream()
                .sorted(Comparator.comparing(Review::getCreatedAt).reversed())
                .toList();

        List<Review> foundReviews = underTest.findByReviewerIdAndCreatedAtBeforeOrderByCreatedAtDesc(REVIEWER_ID, lastCreatedAt, pageable);

        assertThat(foundReviews).isNotNull();
        assertThat(foundReviews).hasSizeLessThanOrEqualTo(PAGE_SIZE);
        assertThat(foundReviews).containsExactlyInAnyOrderElementsOf(sortedReviews.subList(0, foundReviews.size()));

        lastCreatedAt = foundReviews.get(foundReviews.size() - 1).getCreatedAt();
        int expectedRemainingSize = Math.min(PAGE_SIZE, sortedReviews.size() - PAGE_SIZE);

        foundReviews = underTest.findByReviewerIdAndCreatedAtBeforeOrderByCreatedAtDesc(REVIEWER_ID, lastCreatedAt, pageable);

        assertThat(foundReviews).isNotNull();
        assertThat(foundReviews).hasSizeLessThanOrEqualTo(expectedRemainingSize);
        assertThat(foundReviews).containsExactlyInAnyOrderElementsOf(sortedReviews.subList(PAGE_SIZE, PAGE_SIZE + foundReviews.size()));

        lastCreatedAt = foundReviews.get(foundReviews.size() - 1).getCreatedAt();
        expectedRemainingSize = Math.min(PAGE_SIZE, sortedReviews.size() - PAGE_SIZE - PAGE_SIZE);

        foundReviews = underTest.findByReviewerIdAndCreatedAtBeforeOrderByCreatedAtDesc(REVIEWER_ID, lastCreatedAt, pageable);

        assertThat(foundReviews).isNotNull();
        assertThat(foundReviews).hasSizeLessThanOrEqualTo(expectedRemainingSize);
        assertThat(foundReviews).containsExactlyInAnyOrderElementsOf(sortedReviews.subList(PAGE_SIZE + PAGE_SIZE, PAGE_SIZE + PAGE_SIZE + foundReviews.size()));
    }

    private void setUpReviews() {
        for (int i = 0; i < PAGE_SIZE * 2 + 1; i++) {
            Review review = new Review();
            review.setReviewerId("reviewerId" + i);
            review.setReceiverId(RECEIVER_ID);
            review.setRating(4.5);
            review.setText("Sample review " + i);
            review = underTest.save(review);
            receiverReviews.add(review);
        }

        Review newReview = new Review();
        newReview.setReviewerId(REVIEWER_ID);
        newReview.setReceiverId(RECEIVER_ID);
        newReview.setRating(4.5);
        newReview.setText("Sample review");
        newReview = underTest.save(newReview);
        receiverReviews.add(newReview);
        reviewerReviews.add(newReview);

        for (int i = 0; i < PAGE_SIZE * 2 + 1; i++) {
            Review review = new Review();
            review.setReviewerId(REVIEWER_ID);
            review.setReceiverId("receiverId" + i);
            review.setRating(4.5);
            review.setText("Sample review " + i);
            review = underTest.save(review);
            reviewerReviews.add(review);
        }
    }
}
