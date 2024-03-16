package it.homeo.reviewservice.messaging;

import it.homeo.reviewservice.mappers.ReviewStatsMapper;
import it.homeo.reviewservice.models.ReviewStats;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class ReviewEventProducer {

    private final RabbitTemplate rabbitTemplate;
    private final ReviewStatsMapper reviewStatsMapper;

    public ReviewEventProducer(RabbitTemplate rabbitTemplate, ReviewStatsMapper reviewStatsMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.reviewStatsMapper = reviewStatsMapper;
    }

    public void produceAvgReviewUpdated(ReviewStats reviewStats) {
        rabbitTemplate.convertAndSend("", "q.avg-review-updated", reviewStatsMapper.toDto(reviewStats));
    }
}
