package it.homeo.categoryservice.config.kafka;

import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.core.KafkaAdmin;

import java.util.HashMap;
import java.util.Map;

@Profile("!test")
@Configuration
public class KafkaTopicsConfig {

    @Value(value = "${spring.kafka.bootstrap-servers}")
    private String bootstrapAddress;

    @Value(value = "${kafka.producer.topics.delete-category}")
    private String deleteCategoryTopic;

    @Value(value = "${kafka.producer.topics.add-user-to-category}")
    private String addUserToCategoryTopic;

    @Value(value = "${kafka.producer.topics.delete-user-from-category}")
    private String deleteUserFromCategoryTopic;


    @Bean
    public KafkaAdmin kafkaAdmin() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);
        return new KafkaAdmin(configs);
    }

    @Bean
    public NewTopic deleteUserFromCategory() {
        return new NewTopic(deleteUserFromCategoryTopic, 1, (short) 1);
    }

    @Bean
    public NewTopic addUserToCategory() {
        return new NewTopic(addUserToCategoryTopic, 1, (short) 1);
    }

    @Bean
    public NewTopic deleteCategory() {
        return new NewTopic(deleteCategoryTopic, 1, (short) 1);
//        return TopicBuilder.name(categoryServiceDeleteCategoryTopic)
//                .partitions(1)
//                .replicas(1)
//                .build();
    }
}
