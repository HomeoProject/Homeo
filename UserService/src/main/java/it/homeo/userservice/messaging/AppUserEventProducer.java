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

    public void produceUserDeletedEvent(String userId) {
        rabbitTemplate.convertAndSend("x.user-deleted", "", userId);
    }

    public void produceUserIsBlockedEvent(AppUserDto appUserDto) {
        rabbitTemplate.convertAndSend("", "q.user-is-blocked", appUserDto);
    }

    public void produceUserUpdatedAvatarEvent(AppUserDto appUserDto) {
        rabbitTemplate.convertAndSend("", "q.user-updated-avatar", appUserDto);
    }

    public void produceUserUpdatedIsApprovedEvent(AppUserDto appUserDto) {
        rabbitTemplate.convertAndSend("", "q.user-updated-is-approved", appUserDto);
    }
}
