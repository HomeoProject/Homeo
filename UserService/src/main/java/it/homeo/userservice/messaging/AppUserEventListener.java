package it.homeo.userservice.messaging;

import it.homeo.userservice.dtos.request.UserIsOnlineEventDto;
import it.homeo.userservice.exceptions.AppUserNotFoundException;
import it.homeo.userservice.services.AppUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class AppUserEventListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(AppUserEventListener.class);
    private final AppUserService appUserService;

    public AppUserEventListener(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @RabbitListener(queues = "q.user-is-online")
    public void handleUserIsOnlineEvent(UserIsOnlineEventDto dto) {
        LOGGER.info("Inside: AppUserEventListener -> handleUserIsOnlineEvent()...");
        try {
            appUserService.updateAppUserIsOnline(dto.userId(), dto.isOnline());
        } catch (AppUserNotFoundException e) {
            LOGGER.info("Inside: AppUserEventListener -> handleUserIsOnlineEvent()...: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = "q.fall-back-user-is-online")
    public void handleFallbackUserIsOnlineEvent(UserIsOnlineEventDto dto) {
        LOGGER.info("Inside: AppUserEventListener -> handleFallbackUserIsOnlineEvent()...");
        try {
            appUserService.updateAppUserIsOnline(dto.userId(), dto.isOnline());
        } catch (AppUserNotFoundException e) {
            LOGGER.info("Inside: AppUserEventListener -> handleFallbackUserIsOnlineEvent()...: {}", e.getMessage());
        }
    }
}
