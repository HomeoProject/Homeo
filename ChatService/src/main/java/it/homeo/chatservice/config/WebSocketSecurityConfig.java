package it.homeo.chatservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;

// https://docs.spring.io/spring-security/reference/servlet/integrations/websocket.html
@Configuration
@EnableWebSocketSecurity
public class WebSocketSecurityConfig {

    private static final String USER_AUTHORITY = "user:permission";

    @Bean
    public AuthorizationManager<Message<?>> messageAuthorizationManager(MessageMatcherDelegatingAuthorizationManager.Builder messages) {
        messages
//                .nullDestMatcher().authenticated()
//                .simpDestMatchers("/app/**").authenticated()
                .anyMessage().hasAuthority(USER_AUTHORITY);

        return messages.build();
    }

    @Bean(name = "csrfChannelInterceptor")
    ChannelInterceptor csrfChannelInterceptor() {
        return new ChannelInterceptor() { };
    }
}
