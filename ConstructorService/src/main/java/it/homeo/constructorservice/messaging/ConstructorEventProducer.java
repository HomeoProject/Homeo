package it.homeo.constructorservice.messaging;

import it.homeo.constructorservice.mappers.ConstructorMapper;
import it.homeo.constructorservice.models.Constructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class ConstructorEventProducer {

    private final RabbitTemplate rabbitTemplate;
    private final ConstructorMapper constructorMapper;

    public ConstructorEventProducer(RabbitTemplate rabbitTemplate, ConstructorMapper constructorMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.constructorMapper = constructorMapper;
    }

    public void produceConstructorAddedEvent(Constructor constructor) {
        rabbitTemplate.convertAndSend("", "q.constructor-added", constructorMapper.toDto(constructor));
    }

    public void produceConstructorUpdatedEvent(Constructor constructor) {
        rabbitTemplate.convertAndSend("", "q.constructor-updated", constructorMapper.toDto(constructor));
    }

    public void produceConstructorDeletedEvent(String userId) {
        rabbitTemplate.convertAndSend("", "q.constructor-deleted", userId);
    }
}
