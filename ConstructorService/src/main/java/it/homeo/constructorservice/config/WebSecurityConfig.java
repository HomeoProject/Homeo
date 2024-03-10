package it.homeo.constructorservice.config;

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

    private static final String ADMIN_AUTHORITY = "admin:permission";
    private static final String USER_AUTHORITY = "user:permission";
    private static final String CONSTRUCTOR_AUTHORITY = "constructor:permission";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        /*
        This is where we configure the security required for our endpoints and set up our app to serve as
        an OAuth2 Resource Server, using JWT validation.
        */
        return http
                .authorizeHttpRequests(authorize -> authorize
                        // CategoryController
                        .requestMatchers(HttpMethod.POST, "/api/constructors/categories/**").hasAuthority(ADMIN_AUTHORITY)
                        .requestMatchers(HttpMethod.DELETE, "/api/constructors/categories/**").hasAuthority(ADMIN_AUTHORITY)
                        .requestMatchers(HttpMethod.PUT, "/api/constructors/categories/**").hasAuthority(ADMIN_AUTHORITY)
                        // ConstructorController
                        .requestMatchers(HttpMethod.POST, "/api/constructors").hasAuthority(USER_AUTHORITY)
                        .requestMatchers(HttpMethod.PUT, "/api/constructors").hasAuthority(CONSTRUCTOR_AUTHORITY)
                        .requestMatchers(HttpMethod.DELETE, "/api/constructors").hasAuthority(CONSTRUCTOR_AUTHORITY)
                        // All
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
