package it.homeo.userservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = Auth0RolesConfig.PREFIX)
public class Auth0RolesConfig {
    public static final String PREFIX = "okta.auth0.roles";
    private String constructorRoleId;
}
