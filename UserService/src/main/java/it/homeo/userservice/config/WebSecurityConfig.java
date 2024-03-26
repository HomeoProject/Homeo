package it.homeo.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private static final String ADMIN_PERSMISSION = "admin:permission";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        /*
        This is where we configure the security required for our endpoints and set up our app to serve as
        an OAuth2 Resource Server, using JWT validation.
        */
        return http
                .authorizeHttpRequests(authorize -> authorize
                        // Example of permission used route
                        // .requestMatchers("/api/user").hasAuthority("admin:permission")
                        .requestMatchers(HttpMethod.GET, "/api/users/sync").authenticated()
                        .requestMatchers(HttpMethod.PUT, "api/users/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "api/users/{id}").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "api/users/email/{id}").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "api/users/password/{id}").authenticated()
                        .requestMatchers("/api/users/avatar/{id}").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "api/users/approve/{id}").hasAuthority(ADMIN_PERSMISSION)
                        .requestMatchers(HttpMethod.PATCH, "api/users/block/{id}").hasAuthority(ADMIN_PERSMISSION)
                        .requestMatchers(HttpMethod.POST, "api/users/search").hasAuthority(ADMIN_PERSMISSION)
                        .anyRequest().permitAll()
                )
                .cors(withDefaults())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(makePermissionsConverter()))
                )
                .build();
    }

    private JwtAuthenticationConverter makePermissionsConverter() {
        final var jwtAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtAuthoritiesConverter.setAuthoritiesClaimName("permissions");
        jwtAuthoritiesConverter.setAuthorityPrefix("");

        final var jwtAuthConverter = new JwtAuthenticationConverter();
        jwtAuthConverter.setJwtGrantedAuthoritiesConverter(jwtAuthoritiesConverter);

        return jwtAuthConverter;
    }
}
