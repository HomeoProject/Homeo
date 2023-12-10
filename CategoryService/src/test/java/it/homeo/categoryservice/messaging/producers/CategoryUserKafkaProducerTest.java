package it.homeo.categoryservice.messaging.producers;

import com.fasterxml.jackson.core.JsonProcessingException;
import it.homeo.categoryservice.dtos.CategoryUserDto;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;
import org.testcontainers.utility.DockerImageName;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(CategoryUserKafkaProducerTest.KafkaTestContainersConfiguration.class)
@Testcontainers
@DirtiesContext
class CategoryUserKafkaProducerTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest");

    @Container
    public static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"));

    @Autowired
    CategoryUserKafkaProducer underTest;

    @Value(value = "${spring.kafka.consumer.group-id}")
    private String groupId;

    @Value(value = "${kafka.producer.topics.add-user-to-category}")
    private String addUserToCategoryTopic;

    @Value(value = "${kafka.producer.topics.delete-user-from-category}")
    private String deleteUserFromCategoryTopic;

    private KafkaTestConsumerForProducers kafkaTestConsumer;

    @BeforeEach
    void setUp() {
        kafkaTestConsumer = new KafkaTestConsumerForProducers(kafka.getBootstrapServers(), groupId);
    }

    @AfterEach
    void tearDown() {
        kafkaTestConsumer.close();
    }

    @Test
    void connectionEstablished() {
        assertThat(postgres.isCreated()).isTrue();
        assertThat(postgres.isRunning()).isTrue();

        assertThat(kafka.isCreated()).isTrue();
        assertThat(kafka.isRunning()).isTrue();
    }

    @Test
    public void shouldProduceAddUserToCategoryEvent() throws JsonProcessingException {
        kafkaTestConsumer.subscribe(singletonList(addUserToCategoryTopic));

        String userId = "auth0|12345user";
        Long categoryId = 1L;
        String categoryName = "Plumber";
        underTest.produceAddUserToCategoryEvent(new CategoryUserDto(userId, categoryId, categoryName));

        ConsumerRecords<String, String> records = kafkaTestConsumer.poll();
        assertThat(records.count()).isEqualTo(1);
        records.iterator().forEachRemaining(record -> {
            assertThat(record.value()).isNotNull().isNotEmpty();
            assertThat(record.key()).isNull();

            try {
                CategoryUserDto categoryUserDto = new ObjectMapper().readValue(record.value(), CategoryUserDto.class);
                assertThat(categoryUserDto.userId()).isEqualTo(userId);
                assertThat(categoryUserDto.categoryId()).isEqualTo(categoryId);
                assertThat(categoryUserDto.categoryName()).isEqualTo(categoryName);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }

    @Test
    public void shouldProduceDeleteUserFromCategoryEvent() throws JsonProcessingException {
        kafkaTestConsumer.subscribe(singletonList(deleteUserFromCategoryTopic));

        String userId = "auth0|12345user";
        Long categoryId = 1L;
        String categoryName = "Plumber";
        underTest.producerDeleteUserFromCategoryEvent(new CategoryUserDto(userId, categoryId, categoryName));

        ConsumerRecords<String, String> records = kafkaTestConsumer.poll();
        assertThat(records.count()).isEqualTo(1);
        records.iterator().forEachRemaining(record -> {
            assertThat(record.value()).isNotNull().isNotEmpty();
            assertThat(record.key()).isNull();

            try {
                CategoryUserDto categoryUserDto = new ObjectMapper().readValue(record.value(), CategoryUserDto.class);
                assertThat(categoryUserDto.userId()).isEqualTo(userId);
                assertThat(categoryUserDto.categoryId()).isEqualTo(categoryId);
                assertThat(categoryUserDto.categoryName()).isEqualTo(categoryName);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }

    @TestConfiguration
    static class KafkaTestContainersConfiguration {
        @Bean
        public ProducerFactory<String, String> producerFactory() {
            Map<String, Object> configProps = new HashMap<>();
            configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafka.getBootstrapServers());
            configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
            configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
            return new DefaultKafkaProducerFactory<>(configProps);
        }

        @Bean
        public KafkaTemplate<String, String> kafkaTemplate() {
            return new KafkaTemplate<>(producerFactory());
        }
    }
}
