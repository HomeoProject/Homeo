package it.homeo.userservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Auth0RolesConfig {

    @Value("${okta.auth0.roles.constructorRoleId}")
    private String constructorRoleId;

    public String getConstructorRoleId() {
        return constructorRoleId;
    }
}
