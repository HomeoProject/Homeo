# Test

This version of Docker is similar to the Dev environment, but without observability.

Unlike the Local environment, databases and other services are hosted in the cloud, providing a more realistic testing environment. For example, Aiven for PostgreSQL and Redis Unfortunately RabbitMQ is still being used locally because we haven't found a cloud platform where we can install STOMP plugins for free.

This setup is ideal for testing frontend applications without the need to build additional monitoring tools like Grafana.
