FROM gradle:jdk17-alpine AS build
COPY --chown=gradle:gradle . /home/gradle/ApiGateway
WORKDIR /home/gradle/ApiGateway
RUN gradle build --no-daemon

FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=build /home/gradle/ApiGateway/build/libs/ApiGateway-0.0.1-SNAPSHOT.jar /app

ENV REDIS_PASSWORD_APIGATEWAY=${REDIS_PASSWORD_APIGATEWAY:-REPLACE}
ENV ALLOWED_CORS_URLS=${ALLOWED_CORS_URLS:-REPLACE}
ENV EUREKA_URL=${EUREKA_URL:-REPLACE}

ENTRYPOINT ["java","-jar","ApiGateway-0.0.1-SNAPSHOT.jar"]
