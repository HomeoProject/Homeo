package it.homeo.chatservice.messaging;

import it.homeo.chatservice.dtos.response.UserIsOnlineEventDto;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class EventProducer {

    private final RabbitTemplate rabbitTemplate;

    public EventProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void produceUserIsOnlineEvent(String userId, Boolean isOnline) {
        UserIsOnlineEventDto dto = new UserIsOnlineEventDto(userId, isOnline);
        rabbitTemplate.convertAndSend("", "q.user-is-online", dto);
    }
}
