package it.homeo.reviewservice.messaging;

import it.homeo.reviewservice.services.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ReviewEventListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReviewEventProducer.class);
    private final ReviewService reviewService;

    public ReviewEventListener(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @RabbitListener(queues = "q.user-delete-reviews")
    public void deleteAllReviewsWithReceiverId(String receiverId) {
        LOGGER.info("Inside: ReviewEventListener -> deleteAllReviewsWithReceiverId()...");
        reviewService.deleteAllReviewsWithReceiverId(receiverId);
    }

    @RabbitListener(queues = "q.fall-back-user-delete-reviewss")
    public void fallbackDeleteAllReviewsWithReceiverId(String receiverId) {
        LOGGER.info("Inside: ReviewEventListener -> fallbackDeleteAllReviewsWithReceiverId()...");
        reviewService.deleteAllReviewsWithReceiverId(receiverId);
    }
}
