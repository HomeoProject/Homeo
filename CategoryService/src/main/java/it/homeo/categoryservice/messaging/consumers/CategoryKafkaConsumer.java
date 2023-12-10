package it.homeo.categoryservice.messaging.consumers;

import it.homeo.categoryservice.services.ICategoryUserService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.concurrent.CountDownLatch;

@Component
public class CategoryKafkaConsumer {

    private CountDownLatch latch = new CountDownLatch(1);

    private final ICategoryUserService categoryUserService;

    public CategoryKafkaConsumer(ICategoryUserService categoryUserService) {
        this.categoryUserService = categoryUserService;
    }

//  @KafkaListener(topics = {"${kafka.consumer.topics.delete-user}", "${kafka.consumer.topics.delete-constructor-role}"}, groupId = "${spring.kafka.consumer.group-id}")
    @KafkaListener(topics = {"${kafka.consumer.topics.delete-user}"})
    public void consumeDeleteUserTopic(@Payload String userId) {
        categoryUserService.deleteUserFromAllCategories(userId);
        latch.countDown();
    }

    public void resetLatch() {
        latch = new CountDownLatch(1);
    }

    public CountDownLatch getLatch() {
        return latch;
    }
}
