package it.homeo.chatservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

// https://www.springcloud.io/post/2022-03/load-balanced-websockets-with-spring-cloud-gateway/#gsc.tab=0
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${broker.relay.host}")
    private String brokerRelayHost;

    @Value("${broker.relay.username}")
    private String brokerRelayUsername;

    @Value("${broker.relay.password}")
    private String brokerRelayPassword;

    /*
    Topic is auto-deleted
    Queue allows the server to send messages, and when a client reconnects to the socket, it will receive old messages sent by the server
    */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableStompBrokerRelay("/queue", "/topic")
                .setRelayHost(brokerRelayHost)
                .setSystemLogin(brokerRelayUsername)
                .setSystemPasscode(brokerRelayPassword)
                .setClientLogin(brokerRelayUsername)
                .setClientPasscode(brokerRelayPassword);
        registry.setUserDestinationPrefix("/user");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("chat/websocket").setAllowedOrigins("*");
//        registry.addEndpoint("chat/sockjs").setAllowedOrigins("*").withSockJS();
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry
                .setMessageSizeLimit(4 * 1024 * 1024) // 4MB
                .setSendBufferSizeLimit(4 * 1024 * 1024) // 4MB
                .setSendTimeLimit(20 * 10000); // 20 seconds
    }
}
