package it.homeo.userservice.messaging;

import it.homeo.userservice.dtos.response.AppUserDto;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class AppUserEventProducer {

    private final RabbitTemplate rabbitTemplate;

    public AppUserEventProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void produceUserUpdatedEvent(AppUserDto appUserDto) {
        rabbitTemplate.convertAndSend("", "q.user-updated", appUserDto);
    }

    public void produceUserDeletedEvents(String userId) {
        rabbitTemplate.convertAndSend("", "q.user-delete-reviews", userId);
        rabbitTemplate.convertAndSend("", "q.user-delete-constructor", userId);
    }

    public void produceUserIsBlockedEvent(AppUserDto appUserDto) {
        rabbitTemplate.convertAndSend("", "q.user-is-blocked", appUserDto);
    }
}
