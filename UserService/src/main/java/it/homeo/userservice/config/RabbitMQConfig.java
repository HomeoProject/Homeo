package it.homeo.userservice.config;

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
    public Queue createUserDeleteReviewsQueue() {
        return QueueBuilder.durable("q.user-delete-reviews")
                .withArgument("x-dead-letter-exchange", "x.user-delete-reviews-failure")
                .withArgument("x-dead-letter-routing-key", "fall-back-delete-reviews")
                .build();
    }

    @Bean
    public Queue createUserDeleteConstrcutorQueue() {
        return QueueBuilder.durable("q.user-delete-constructor")
                .withArgument("x-dead-letter-exchange", "x.user-delete-constructor-failure")
                .withArgument("x-dead-letter-routing-key", "fall-back-delete-constructor")
                .build();
    }

    @Bean
    public Queue createUserUpdatedQueue() {
        return QueueBuilder.durable("q.user-updated")
                .withArgument("x-dead-letter-exchange", "x.user-updated-failure")
                .withArgument("x-dead-letter-routing-key", "fall-back-user-updated")
                .build();
    }

    // DLQ
    @Bean
    public Declarables createDeadLetterSchemaDeleteReviews() {
        return new Declarables(
                new DirectExchange("x.user-delete-reviews-failure"),
                new Queue("q.fall-back-user-delete-reviews"),
                new Binding("q.fall-back-user-delete-reviews", Binding.DestinationType.QUEUE, "x.user-delete-reviews-failure", "fall-back-delete-reviews", null)
        );
    }

    @Bean
    public Declarables createDeadLetterSchemaDeleteConstructor() {
        return new Declarables(
                new DirectExchange("x.user-delete-constructor-failure"),
                new Queue("q.fall-back-user-delete-constructor"),
                new Binding("q.fall-back-user-delete-constructor", Binding.DestinationType.QUEUE, "x.user-delete-constructor-failure", "fall-back-delete-constructor", null)
        );
    }

    @Bean
    public Declarables createDeadLetterSchemaUpdated() {
        return new Declarables(
                new DirectExchange("x.user-updated-failure"),
                new Queue("q.fall-back-user-updated"),
                new Binding("q.fall-back-user-updated", Binding.DestinationType.QUEUE, "x.user-updated-failure", "fall-back-user-updated", null)
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
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(Jackson2JsonMessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(cachingConnectionFactory);
        template.setMessageConverter(converter);
        return template;
    }
}
