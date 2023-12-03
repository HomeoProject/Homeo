FROM gradle:jdk17-alpine AS build
COPY --chown=gradle:gradle . /home/gradle/CategoryService
WORKDIR /home/gradle/CategoryService
RUN gradle clean build -x test

FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=build /home/gradle/CategoryService/build/libs/CategoryService-0.0.1-SNAPSHOT.jar /app
ENTRYPOINT ["java","-jar","CategoryService-0.0.1-SNAPSHOT.jar"]
