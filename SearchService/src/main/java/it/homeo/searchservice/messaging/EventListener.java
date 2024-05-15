package it.homeo.searchservice.messaging;

import it.homeo.searchservice.dtos.request.AppUserDto;
import it.homeo.searchservice.dtos.request.ConstructorDto;
import it.homeo.searchservice.dtos.request.ReviewStatsDto;
import it.homeo.searchservice.services.ConstructorSearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class EventListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(EventListener.class);
    private final ConstructorSearchService constructorSearchService;

    public EventListener(ConstructorSearchService constructorSearchService) {
        this.constructorSearchService = constructorSearchService;
    }

    @RabbitListener(queues = "q.constructor-added")
    public void handleConstructorAddedEvent(ConstructorDto dto) {
        LOGGER.info("Inside: EventListener -> handleConstructorAddedEvent()...");
        constructorSearchService.addConstructorSearch(dto);
    }

    @RabbitListener(queues = "q.fall-back-constructor-added")
    public void handleFallbackConstructorAddedEvent(ConstructorDto dto) {
        LOGGER.info("Inside: EventListener -> handleFallbackConstructorAddedEvent()...");
        constructorSearchService.addConstructorSearch(dto);
    }

    @RabbitListener(queues = "q.constructor-updated")
    public void handleConstructorUpdatedEvent(ConstructorDto dto) {
        LOGGER.info("Inside: EventListener -> handleConstructorUpdatedEvent()...");
        constructorSearchService.updateConstructorSearch(dto);
    }

    @RabbitListener(queues = "q.fall-back-constructor-updated")
    public void handleFallbackConstructorUpdatedEvent(ConstructorDto dto) {
        LOGGER.info("Inside: EventListener -> handleFallbackConstructorUpdatedEvent()...");
        constructorSearchService.updateConstructorSearch(dto);
    }

    @RabbitListener(queues = "q.constructor-deleted")
    public void handleConstructorDeletedEvent(String userId) {
        LOGGER.info("Inside: EventListener -> handleConstructorDeletedEvent()...");
        constructorSearchService.deleteConstructorSearch(userId);
    }

    @RabbitListener(queues = "q.fall-back-constructor-deleted")
    public void handleFallbackConstructorDeletedEvent(String userId) {
        LOGGER.info("Inside: EventListener -> handleFallbackConstructorDeletedEvent()...");
        constructorSearchService.deleteConstructorSearch(userId);
    }

    @RabbitListener(queues = "q.avg-review-updated")
    public void handleAvgReviewUpdatedEvent(ReviewStatsDto dto) {
        LOGGER.info("Inside: EventListener -> handleAvgReviewUpdatedEvent()...");
        constructorSearchService.updateConstructorSearch(dto);
    }

    @RabbitListener(queues = "q.fall-back-avg-review-updated")
    public void handleFallbackAvgReviewUpdatedEvent(ReviewStatsDto dto) {
        LOGGER.info("Inside: EventListener -> handleFallbackAvgReviewUpdatedEvent()...");
        constructorSearchService.updateConstructorSearch(dto);
    }

    @RabbitListener(queues = {"q.user-updated", "q.user-updated-avatar", "q.user-updated-is-approved"})
    public void handleUserEvents(AppUserDto dto) {
        LOGGER.info("Inside: EventListener -> handleUserEvents()...");
        constructorSearchService.updateConstructorSearch(dto);
    }

    @RabbitListener(queues = {"q.fall-back-user-updated", "q.fall-back-user-updated-avatar", "q.fall-back-user-updated-is-approved"})
    public void handleFallbackUserEvents(AppUserDto dto) {
        LOGGER.info("Inside: EventListener -> handleFallbackUserEvents()...");
        constructorSearchService.updateConstructorSearch(dto);
    }

    @RabbitListener(queues = "q.user-is-blocked")
    public void handleUserIsBlockedEvent(AppUserDto dto) {
        LOGGER.info("Inside: EventListener -> handleUserIsBlockedEvent()...");
        if (dto.isBlocked()) {
            constructorSearchService.deleteConstructorSearch(dto.id());
        } else {
            constructorSearchService.addConstructorSearch(dto);
        }
    }

    @RabbitListener(queues = "q.fall-back-user-is-blocked")
    public void handleFallbackUserIsBlockedEvent(AppUserDto dto) {
        LOGGER.info("Inside: EventListener -> handleFallbackUserIsBlockedEvent()...");
        if (dto.isBlocked()) {
            constructorSearchService.deleteConstructorSearch(dto.id());
        } else {
            constructorSearchService.addConstructorSearch(dto);
        }
    }
}
