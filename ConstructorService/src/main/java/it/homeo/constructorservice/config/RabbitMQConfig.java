package it.homeo.constructorservice.config;

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
    public Queue createConstructorAddedQueue() {
        return QueueBuilder.durable("q.constructor-added")
                .withArgument("x-dead-letter-exchange", "x.constructor-added-failure")
                .withArgument("x-dead-letter-routing-key", "fall-back-constructor-added")
                .build();
    }

    @Bean
    public Queue createConstructorDeletedQueue() {
        return QueueBuilder.durable("q.constructor-deleted")
                .withArgument("x-dead-letter-exchange", "x.constructor-deleted-failure")
                .withArgument("x-dead-letter-routing-key","fall-back-constructor-deleted")
                .build();
    }

    @Bean
    public Queue createConstructorUpdatedQueue() {
        return QueueBuilder.durable("q.constructor-updated")
                .withArgument("x-dead-letter-exchange", "x.constructor-updated-failure")
                .withArgument("x-dead-letter-routing-key","fall-back-constructor-updated")
                .build();
    }

    // DLQ
    @Bean
    public Declarables createDeadLetterSchemaAdded() {
        return new Declarables(
                new DirectExchange("x.constructor-added-failure"),
                new Queue("q.fall-back-constructor-added"),
                new Binding("q.fall-back-constructor-added", Binding.DestinationType.QUEUE, "x.constructor-added-failure", "fall-back-constructor-added", null)
        );
    }

    @Bean
    public Declarables createDeadLetterSchemaDeleted() {
        return new Declarables(
                new DirectExchange("x.constructor-deleted-failure"),
                new Queue("q.fall-back-constructor-deleted"),
                new Binding("q.fall-back-constructor-deleted", Binding.DestinationType.QUEUE, "x.constructor-deleted-failure", "fall-back-constructor-deleted", null)
        );
    }

    @Bean
    public Declarables createDeadLetterSchemaUpdated() {
        return new Declarables(
                new DirectExchange("x.constructor-updated-failure"),
                new Queue("q.fall-back-constructor-updated"),
                new Binding("q.fall-back-constructor-updated", Binding.DestinationType.QUEUE, "x.constructor-updated-failure", "fall-back-constructor-updated", null)
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
