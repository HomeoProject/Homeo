package it.homeo.apigateway.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import org.springframework.cloud.circuitbreaker.resilience4j.ReactiveResilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import java.time.Duration;

@Configuration
public class RouteLocatorConfig {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // UserService
                .route("UserServiceSwagger-Route", request -> request
                        .path("/userservice/api-docs")
                        .and().method(HttpMethod.GET)
                        .uri("lb://UserService"))
                .route("UserService-Route", request -> request
                        .path("/api/users/**")
                        .filters(f -> f
                                .requestRateLimiter(r -> r.setRateLimiter(redisRateLimiter()))
                                // Example of retry mechanism
                                // .retry(retryConfig -> retryConfig
                                // .setRetries(3)
                                // .setMethods(HttpMethod.GET)
                                // .setBackoff(Duration.ofMillis(100), Duration.ofMillis(1000), 2, true))
                                .circuitBreaker(config -> config
                                        // Example of fallback URI
                                        // .setFallbackUri("forward:/contact-support")))
                                        .setName("UserServiceCircuitBreaker")))
                        // If we want to change the keyResolver to non-primary, just:
                        // .setKeyResolver(otherResolver)))
                        .uri("lb://UserService"))

                // ConstructorService
                .route("ConstructorServiceSwagger-Route", request -> request
                        .path("/constructorservice/api-docs")
                        .and().method(HttpMethod.GET)
                        .uri("lb://ConstructorService"))
                .route("ConstructorService-Route", request -> request
                        .path("/api/constructors/**")
                        .filters(f -> f
                                .requestRateLimiter(r -> r.setRateLimiter(redisRateLimiter()))
                                .circuitBreaker(config -> config
                                        .setName("ConstructorServiceCircuitBreaker")))
                        .uri("lb://ConstructorService"))

                // ReviewService
                .route("ReviewServiceSwagger-Route", request -> request
                        .path("/reviewservice/api-docs")
                        .and().method(HttpMethod.GET)
                        .uri("lb://ReviewService"))
                .route("ReviewService-Route", request -> request
                        .path("/api/reviews/**")
                        .filters(f -> f
                                .requestRateLimiter(r -> r.setRateLimiter(redisRateLimiter()))
                                .circuitBreaker(config -> config
                                        .setName("ReviewServiceCircuitBreaker")))
                        .uri("lb://ReviewService"))

                // SearchService
                .route("SearchServiceSwagger-Route", request -> request
                        .path("/searchservice/api-docs")
                        .and().method(HttpMethod.GET)
                        .uri("lb://SearchService"))
                .route("SearchService-Route", request -> request
                        .path("/api/search/**")
                        .filters(f -> f
                                .requestRateLimiter(r -> r.setRateLimiter(redisRateLimiter()))
                                .circuitBreaker(config -> config
                                        .setName("SearchServiceCircuitBreaker")))
                        .uri("lb://SearchService"))

                // ChatService
                .route("ChatServiceSwagger-Route", request -> request
                        .path("/chatservice/api-docs")
                        .and().method(HttpMethod.GET)
                        .uri("lb://ChatService"))
                .route("ChatService-Route", request -> request
                        .path("/api/chat/**")
                        .filters(f -> f
                                .requestRateLimiter(r -> r.setRateLimiter(redisRateLimiter()))
                                .circuitBreaker(config -> config
                                        .setName("ChatServiceCircuitBreaker")))
                        .uri("lb://ChatService"))
                .route("SearchService-WS-Route", request -> request
                        .path("/chat/**")
                        .uri("lb://ChatService"))

                .build();
    }

    /*
     * This method configures a RedisRateLimiter bean.
     * It defines the rate limiting parameters such as:
     * - defaultReplenishRate: Maximum number of requests per second allowed.
     * - defaultBurstCapacity: Maximum burst capacity, representing the maximum number of requests that can be
     *   served at once without rate limiting.
     * - defaultRequestedTokens: Default number of tokens requested for each request.
     */
    @Bean
    public RedisRateLimiter redisRateLimiter() {
        int defaultReplenishRate = 10;

        int defaultBurstCapacity = 20;

        int defaultRequestedTokens = 1;

        return new RedisRateLimiter(defaultReplenishRate, defaultBurstCapacity, defaultRequestedTokens);
    }

    /*
     * This method configures default resilience settings for the ReactiveResilience4JCircuitBreakerFactory.
     * Circuit Breaker and Time Limiter configurations can alternatively be defined in the application.yml file.
     *
     * Circuit Breaker Configuration:
     * - slidingWindowSize(n): Sets the size of the sliding window used by the Circuit Breaker to n.
     * - permittedNumberOfCallsInHalfOpenState(n): Defines the maximum number of calls permitted in the half-open state,
     *   which allows the Circuit Breaker to test the health of the service after transitioning from the open state.
     * - failureRateThreshold(n): Sets the failure rate threshold to n%, which triggers the Circuit Breaker to open
     *   if the failure rate exceeds this threshold.
     * - waitDurationInOpenState(Duration.ofMillis(n)): Specifies the duration the Circuit Breaker remains open
     *   before transitioning to the half-open state, allowing some requests to pass through for testing.
     *
     * Time Limiter Configuration:
     * - timeoutDuration(Duration.ofMillis(n)): Sets the timeout duration to n milliseconds (n / 1000 seconds), which
     *   defines the maximum time the service is allowed to respond before timing out.
     */
    @Bean
    public Customizer<ReactiveResilience4JCircuitBreakerFactory> defaultCustomizer() {
        return factory -> factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
                .circuitBreakerConfig(CircuitBreakerConfig.custom()
                        .slidingWindowSize(10)
                        .permittedNumberOfCallsInHalfOpenState(2)
                        .failureRateThreshold(50.0F)
                        .waitDurationInOpenState(Duration.ofMillis(1000))
                        .build())
                .timeLimiterConfig(TimeLimiterConfig.custom()
                        .timeoutDuration(Duration.ofMillis(3000))
                        .build())
                .build());
    }
}
