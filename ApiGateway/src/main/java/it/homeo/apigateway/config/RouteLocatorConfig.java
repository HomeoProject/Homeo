package it.homeo.apigateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class RouteLocatorConfig {
    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("UserServiceSwagger-Route", request -> request
                        .path("/userservice/api-docs")
                        .and().method(HttpMethod.GET)
                        .uri("lb://UserService"))
                .route("UserService-Route", request -> request
                        .path("/api/users/**")
                        .filters(f -> f.requestRateLimiter(r -> r.setRateLimiter(redisRateLimiter())))
//                        If we want to change the keyResolver to non-primary, just:
//                        .setKeyResolver(otherResolver)))
                        .uri("lb://UserService"))
                .build();
    }

    @Bean
    public RedisRateLimiter redisRateLimiter() {
        // Specify the maximum requests per second.
        int defaultReplenishRate = 10;

        // Specify the maximum burst capacity.
        int defaultBurstCapacity = 20;

        // Specify the default requested tokens.
        int defaultRequestedTokens = 1;

        return new RedisRateLimiter(defaultReplenishRate, defaultBurstCapacity, defaultRequestedTokens);
    }
}
