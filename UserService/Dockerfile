FROM gradle:jdk17-alpine AS build
COPY --chown=gradle:gradle . /home/gradle/UserService
WORKDIR /home/gradle/UserService
RUN gradle build --no-daemon

FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=build /home/gradle/UserService/build/libs/UserService-0.0.1-SNAPSHOT.jar /app
ENTRYPOINT ["java","-jar","UserService-0.0.1-SNAPSHOT.jar"]
