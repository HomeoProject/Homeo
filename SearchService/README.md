# Search Service

## About

Search Service is a microservice responsible for facilitating searches among constructors within the Homeo application. It enables users to efficiently search for constructors based on various criteria.

This service uses Java 17, Spring Boot, JPA, RabbitMQ, Feign clients, Auth0 as Idp provider, and more.

While initially intended to utilize ElasticSearch or another search engine for enhanced search capabilities, the module currently relies on PostgreSQL for search functionality.
