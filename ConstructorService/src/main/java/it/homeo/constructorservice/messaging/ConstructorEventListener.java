package it.homeo.constructorservice.messaging;

import com.auth0.exception.Auth0Exception;
import it.homeo.constructorservice.services.ConstructorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ConstructorEventListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(ConstructorEventListener.class);
    private final ConstructorService constructorService;

    public ConstructorEventListener(ConstructorService constructorService) {
        this.constructorService = constructorService;
    }

    @RabbitListener(queues = "q.user-delete-constructor")
    public void deleteConstructor(String userId) throws Auth0Exception {
        LOGGER.info("Inside: ConstructorEventListener -> deleteConstructor()...");
        constructorService.deleteConstructorByUserId(userId);
    }

    /*
    This is a fallback if the deleteConstructor() method fails,
    we should maybe have some better logging or writing to the DLQ database here,
    but I'm trying to reprocess the event
     */
    @RabbitListener(queues = "q.fall-back-user-delete-constructor")
    public void fallbackDeleteConstructor(String userId) throws Auth0Exception {
        LOGGER.info("Inside: ConstructorEventListener -> fallbackDeleteConstructor()...");
        constructorService.deleteConstructorByUserId(userId);
    }
}
