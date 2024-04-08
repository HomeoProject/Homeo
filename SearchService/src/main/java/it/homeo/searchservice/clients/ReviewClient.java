package it.homeo.searchservice.clients;

import it.homeo.searchservice.dtos.request.ReviewStatsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ReviewService", url = "${feign.client.urls.ReviewService}")
public interface ReviewClient {

    @GetMapping("/api/reviews/stats/{userId}")
    ReviewStatsDto getUserReviewStats(@PathVariable("userId") String userId);
}
