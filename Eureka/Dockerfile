FROM gradle:jdk17-alpine AS build
COPY --chown=gradle:gradle . /home/gradle/Eureka
WORKDIR /home/gradle/Eureka
RUN gradle build --no-daemon

FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=build /home/gradle/Eureka/build/libs/Eureka-0.0.1-SNAPSHOT.jar /app
COPY --from=build /home/gradle/Eureka/build/output/libs/opentelemetry-javaagent.jar /app

ENV PORT=${PORT_EUREKA:-8761}

ENTRYPOINT ["java","-jar","Eureka-0.0.1-SNAPSHOT.jar"]
