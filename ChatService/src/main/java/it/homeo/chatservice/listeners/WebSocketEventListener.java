package it.homeo.chatservice.listeners;

import it.homeo.chatservice.messaging.EventProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Component
public class WebSocketEventListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final EventProducer eventProducer;

    public WebSocketEventListener(EventProducer eventProducer) {
        this.eventProducer = eventProducer;
    }

    @EventListener
    public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
        LOGGER.info("Inside: WebSocketEventListener -> handleSessionDisconnectEvent()...");
        Principal principal = event.getUser();
        if (principal != null) {
            eventProducer.produceUserIsOnlineEvent(principal.getName(), false);
        }
    }

    @EventListener
    public void handleSessionConnectEvent(SessionConnectEvent event) {
        LOGGER.info("Inside: WebSocketEventListener -> handleSessionConnectEvent()...");
        Principal principal = event.getUser();
        if (principal != null) {
            eventProducer.produceUserIsOnlineEvent(principal.getName(), true);
        }
    }
}
