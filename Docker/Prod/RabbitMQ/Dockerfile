FROM rabbitmq:3.13.0-management-alpine

RUN rabbitmq-plugins enable rabbitmq_stomp
RUN rabbitmq-plugins enable rabbitmq_prometheus

COPY rabbitmq.conf /etc/rabbitmq

RUN cat /etc/rabbitmq/rabbitmq.conf