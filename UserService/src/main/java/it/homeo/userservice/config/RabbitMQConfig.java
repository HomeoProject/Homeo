package it.homeo.userservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.boot.autoconfigure.amqp.SimpleRabbitListenerContainerFactoryConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.interceptor.RetryOperationsInterceptor;

@Configuration
public class RabbitMQConfig {

    private final CachingConnectionFactory cachingConnectionFactory;

    public RabbitMQConfig(CachingConnectionFactory cachingConnectionFactory) {
        this.cachingConnectionFactory = cachingConnectionFactory;
    }

    // Queues
    @Bean
    public Queue createUserUpdatedQueue() {
        return QueueBuilder.durable("q.user-updated")
                .withArgument("x-dead-letter-exchange", "x.user-updated-failure")
                .withArgument("x-dead-letter-routing-key", "fall-back-user-updated")
                .build();
    }

    @Bean
    public Queue createUserIsBlockedQueue() {
        return QueueBuilder.durable("q.user-is-blocked")
                .withArgument("x-dead-letter-exchange", "x.user-is-blocked-failure")
                .withArgument("x-dead-letter-routing-key", "fall-back-user-is-blocked")
                .build();
    }

    @Bean
    public Queue createUserUpdatedAvatarQueue() {
        return QueueBuilder.durable("q.user-updated-avatar")
                .withArgument("x-dead-letter-exchange", "x.user-updated-avatar-failure")
                .withArgument("x-dead-letter-routing-key", "fall-back-user-updated-avatar")
                .build();
    }

    @Bean
    public Queue createUserUpdatedIsApprovedQueue() {
        return QueueBuilder.durable("q.user-updated-is-approved")
                .withArgument("x-dead-letter-exchange", "x.user-updated-is-approved-failure")
                .withArgument("x-dead-letter-routing-key", "fall-back-user-updated-is-approved")
                .build();
    }

    // Exchange with queues
    @Bean
    public Declarables createUserDeletedSchema() {
        Queue userDeleteReviewsQueue = QueueBuilder.durable("q.user-delete-reviews")
                .withArgument("x-dead-letter-exchange", "x.user-delete-reviews-failure")
                .withArgument("x-dead-letter-routing-key", "fall-back-user-delete-reviews")
                .build();

        Queue userDeleteConstructorQueue = QueueBuilder.durable("q.user-delete-constructor")
                .withArgument("x-dead-letter-exchange", "x.user-delete-constructor-failure")
                .withArgument("x-dead-letter-routing-key", "fall-back-user-delete-constructor")
                .build();

        return new Declarables(
                new FanoutExchange("x.user-deleted"),
                userDeleteReviewsQueue,
                userDeleteConstructorQueue,
                new Binding("q.user-delete-reviews", Binding.DestinationType.QUEUE, "x.user-deleted", "user-delete-reviews", null),
                new Binding("q.user-delete-constructor", Binding.DestinationType.QUEUE, "x.user-deleted", "user-delete-constructor", null)
        );
    }

    // DLQs
    @Bean
    public Declarables createDeadLetterSchemaUpdated() {
        return new Declarables(
                new DirectExchange("x.user-updated-failure"),
                new Queue("q.fall-back-user-updated"),
                new Binding("q.fall-back-user-updated", Binding.DestinationType.QUEUE, "x.user-updated-failure", "fall-back-user-updated", null)
        );
    }

    @Bean
    public Declarables createDeadLetterSchemaIsBlocked() {
        return new Declarables(
                new DirectExchange("x.user-is-blocked-failure"),
                new Queue("q.fall-back-user-is-blocked"),
                new Binding("q.fall-back-user-is-blocked", Binding.DestinationType.QUEUE, "x.user-is-blocked-failure", "fall-back-user-is-blocked", null)
        );
    }

    @Bean
    public Declarables createDeadLetterSchemaDeleteReviews() {
        return new Declarables(
                new DirectExchange("x.user-delete-reviews-failure"),
                new Queue("q.fall-back-user-delete-reviews"),
                new Binding("q.fall-back-user-delete-reviews", Binding.DestinationType.QUEUE, "x.user-delete-reviews-failure", "fall-back-user-delete-reviews", null)
        );
    }

    @Bean
    public Declarables createDeadLetterSchemaDeleteConstructor() {
        return new Declarables(
                new DirectExchange("x.user-delete-constructor-failure"),
                new Queue("q.fall-back-user-delete-constructor"),
                new Binding("q.fall-back-user-delete-constructor", Binding.DestinationType.QUEUE, "x.user-delete-constructor-failure", "fall-back-user-delete-constructor", null)
        );
    }

    @Bean
    public Declarables createDeadLetterSchemaUserUpdatedAvatar() {
        return new Declarables(
                new DirectExchange("x.user-updated-avatar-failure"),
                new Queue("q.fall-back-user-updated-avatar"),
                new Binding("q.fall-back-user-updated-avatar", Binding.DestinationType.QUEUE, "x.user-updated-avatar-failure", "fall-back-user-updated-avatar", null)
        );
    }

    @Bean
    public Declarables createDeadLetterSchemaUserUpdatedIsApproved() {
        return new Declarables(
                new DirectExchange("x.user-updated-is-approved"),
                new Queue("q.fall-back-user-updated-is-approved"),
                new Binding("q.fall-back-user-updated-is-approved", Binding.DestinationType.QUEUE, "x.user-updated-is-approved-failure", "fall-back-user-updated-is-approved", null)
        );
    }

    // Graceful retry mechanism
    @Bean
    public RetryOperationsInterceptor retryInterceptor() {
        return RetryInterceptorBuilder.stateless().maxAttempts(3)
                .backOffOptions(2000, 2.0, 100000)
                .recoverer(new RejectAndDontRequeueRecoverer())
                .build();
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(SimpleRabbitListenerContainerFactoryConfigurer configurer) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        configurer.configure(factory, cachingConnectionFactory);
        factory.setAcknowledgeMode(AcknowledgeMode.AUTO);
        factory.setAdviceChain(retryInterceptor());
        factory.setDefaultRequeueRejected(false);
        return factory;
    }

    @Bean
    public Jackson2JsonMessageConverter converter() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(Jackson2JsonMessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(cachingConnectionFactory);
        template.setMessageConverter(converter);
        return template;
    }
}
