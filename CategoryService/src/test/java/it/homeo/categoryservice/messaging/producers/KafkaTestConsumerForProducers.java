package it.homeo.categoryservice.messaging.producers;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.List;
import java.util.Properties;

public class KafkaTestConsumerForProducers {
    private final KafkaConsumer<String, String> consumer;

    public KafkaTestConsumerForProducers(String bootstrapServers, String groupId) {
        Properties props = new Properties();

        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        this.consumer = new KafkaConsumer<>(props);
    }

    public void subscribe(List<String> topics) {
        consumer.subscribe(topics);
    }

    public void close() {
        consumer.close();
    }

    public ConsumerRecords<String, String> poll() {
        return consumer.poll(Duration.ofSeconds(5));
    }
}
