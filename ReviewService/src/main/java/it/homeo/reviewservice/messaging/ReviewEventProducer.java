package it.homeo.reviewservice.messaging;

import it.homeo.reviewservice.mappers.ReviewMapper;
import it.homeo.reviewservice.models.ReviewStats;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class ReviewEventProducer {

    private final RabbitTemplate rabbitTemplate;
    private final ReviewMapper reviewMapper;

    public ReviewEventProducer(RabbitTemplate rabbitTemplate, ReviewMapper reviewMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.reviewMapper = reviewMapper;
    }

    public void produceAvgReviewUpdated(ReviewStats reviewStats) {
        rabbitTemplate.convertAndSend("", "q.avg-review-updated", reviewMapper.toDto(reviewStats));
    }
}
