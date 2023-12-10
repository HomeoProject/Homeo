package it.homeo.categoryservice.messaging.producers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import it.homeo.categoryservice.dtos.CategoryUserDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class CategoryUserKafkaProducer {

    @Value(value = "${kafka.producer.topics.add-user-to-category}")
    private String addUserToCategoryTopic;

    @Value(value = "${kafka.producer.topics.delete-user-from-category}")
    private String deleteUserFromCategoryTopic;

    private final KafkaTemplate<String, String> kafkaTemplate;

    public CategoryUserKafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void produceAddUserToCategoryEvent(CategoryUserDto dto) throws JsonProcessingException {
        ObjectWriter objectWriter = new ObjectMapper().writer().withDefaultPrettyPrinter();
        String json = objectWriter.writeValueAsString(dto);
        kafkaTemplate.send(addUserToCategoryTopic, json);
    }

    public void producerDeleteUserFromCategoryEvent(CategoryUserDto dto) throws JsonProcessingException {
        ObjectWriter objectWriter = new ObjectMapper().writer().withDefaultPrettyPrinter();
        String json = objectWriter.writeValueAsString(dto);
        kafkaTemplate.send(deleteUserFromCategoryTopic, json);
    }
}
