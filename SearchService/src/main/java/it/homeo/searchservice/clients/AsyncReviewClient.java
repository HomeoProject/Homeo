package it.homeo.searchservice.clients;

import it.homeo.searchservice.dtos.request.ReviewStatsDto;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class AsyncReviewClient {

    private final ReviewClient reviewClient;

    public AsyncReviewClient(ReviewClient reviewClient) {
        this.reviewClient = reviewClient;
    }

    @Async
    public CompletableFuture<ReviewStatsDto> getUserReviewStatsAsync(String userId) {
        return CompletableFuture.completedFuture(reviewClient.getUserReviewStats(userId));
    }
}
