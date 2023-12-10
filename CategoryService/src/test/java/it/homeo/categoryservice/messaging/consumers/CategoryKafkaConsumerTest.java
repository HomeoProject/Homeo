package it.homeo.categoryservice.messaging.consumers;

import it.homeo.categoryservice.services.ICategoryUserService;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static org.mockito.Mockito.verify;
import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(CategoryKafkaConsumerTest.KafkaTestContainersConfiguration.class)
@Testcontainers
@DirtiesContext
class CategoryKafkaConsumerTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest");

    @Container
    public static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"));

    @Autowired
    KafkaTemplate<String, String> kafkaTemplate;

    @MockBean
    private ICategoryUserService categoryUserService;

    @Autowired
    private CategoryKafkaConsumer underTest;

    @Captor
    private ArgumentCaptor<String> userIdCaptor;

    @Value(value = "${kafka.consumer.topics.delete-user}")
    private String deleteUserTopic;

//    @Value(value = "${kafka.consumer.topics.delete-constructor-role}")
//    private String deleteConstructorRoleTopic;

    private static String DELETE_USER_TOPIC;
//    private static String DELETE_CONSTRUCTOR_ROLE_TOPIC;
    private static final String TEST_USER_ID = "auth0|user430928";

    @Value(value = "${kafka.consumer.topics.delete-user}")
    public void setDeleteUserTopicStatic() {
        CategoryKafkaConsumerTest.DELETE_USER_TOPIC = deleteUserTopic;
    }

//    @Value(value = "${kafka.consumer.topics.delete-constructor-role}")
//    public void setDeleteConstructorRoleTopicStatic() {
//        CategoryKafkaConsumerTest.DELETE_CONSTRUCTOR_ROLE_TOPIC = deleteConstructorRoleTopic;
//    }


    @BeforeEach
    void setUp() {
        underTest.resetLatch();
    }

    @Test
    void connectionEstablished() {
        assertThat(postgres.isCreated()).isTrue();
        assertThat(postgres.isRunning()).isTrue();

        assertThat(kafka.isCreated()).isTrue();
        assertThat(kafka.isRunning()).isTrue();
    }

    @ParameterizedTest
    @MethodSource("prepareConsumeDeleteUserTopicData")
    void shouldConsumeTopics(String testUserId, String topicName) throws InterruptedException {
        kafkaTemplate.send(topicName, testUserId);

        boolean messageConsumed = underTest.getLatch().await(10, TimeUnit.SECONDS);
        assertThat(messageConsumed).isTrue();

        verify(categoryUserService).deleteUserFromAllCategories(userIdCaptor.capture());
        String capturedUserId = userIdCaptor.getValue();

        assertThat(capturedUserId).isEqualTo(testUserId);
    }

    private static Stream<Arguments> prepareConsumeDeleteUserTopicData() {
        return Stream.of(
                Arguments.of(TEST_USER_ID, DELETE_USER_TOPIC)
//                Arguments.of(TEST_USER_ID, DELETE_CONSTRUCTOR_ROLE_TOPIC)
        );
    }

    @TestConfiguration
    static class KafkaTestContainersConfiguration {

        @Value(value = "${spring.kafka.consumer.group-id}")
        private String groupId;

        @Bean
        ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
            ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
            factory.setConsumerFactory(consumerFactory());
            return factory;
        }

        @Bean
        public ConsumerFactory<String, String> consumerFactory() {
            Map<String, Object> props = new HashMap<>();
            props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafka.getBootstrapServers());
            props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest"); // For test purposes only
            props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
            props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
            props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
            return new DefaultKafkaConsumerFactory<>(props);
        }

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
