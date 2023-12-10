package it.homeo.categoryservice.messaging.producers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class CategoryKafkaProducer {

    @Value(value = "${kafka.producer.topics.delete-category}")
    private String deleteCategoryTopic;

    private final KafkaTemplate<String, String> kafkaTemplate;

    public CategoryKafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void produceDeleteCategoryEvent(Long categoryId) {
        kafkaTemplate.send(deleteCategoryTopic, categoryId.toString());
    }
}
