FROM gradle:jdk17-alpine AS build
COPY --chown=gradle:gradle . /home/gradle/ConstructorService
WORKDIR /home/gradle/ConstructorService
RUN gradle clean build -x test

FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=build /home/gradle/ConstructorService/build/libs/ConstructorService-0.0.1-SNAPSHOT.jar /app

# ENV variables to replace
ENV OKTA_API_ISSUER=${OKTA_API_ISSUER:-REPLACE}
ENV OKTA_API_AUDIENCE=${OKTA_API_AUDIENCE:-REPLACE}
ENV POSTGRES_USER=${POSTGRES_USER:-REPLACE}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-REPLACE}
ENV POSTGRES_URL=${POSTGRES_URL_USERSERVICE:-REPLACE}
ENV EUREKA_URL=${EUREKA_URL:-REPLACE}
ENV OPENAPI_URL=${OPENAPI_URL:-REPLACE}

ENTRYPOINT ["java","-jar","ConstructorService-0.0.1-SNAPSHOT.jar"]