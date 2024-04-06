package it.homeo.searchservice.messaging;

import it.homeo.searchservice.dtos.request.ConstructorDto;
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
    public void addConstructorSearch(ConstructorDto dto) {
        LOGGER.info("Inside: EventListener -> addConstructorSearch()...");
        constructorSearchService.addConstructorSearch(dto);
    }

    @RabbitListener(queues = "q.fall-back-constructor-added")
    public void fallbackAddConstructorSearch(ConstructorDto dto) {
        LOGGER.info("Inside: EventListener -> fallbackAddConstructorSearch()...");
        constructorSearchService.addConstructorSearch(dto);
    }
}
