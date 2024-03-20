package it.homeo.reviewservice.config;

import com.auth0.client.auth.AuthAPI;
import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.auth.TokenHolder;
import com.auth0.net.TokenRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Auth0SDKConfig {

    // If there is a problem with the durability of the token, change the scope of the Bean to prototype
    @Bean
    public ManagementAPI managementAPI(
            @Value("${okta.sdk.domain}") String domain,
            @Value("${okta.sdk.client-id}") String clientId,
            @Value("${okta.sdk.client-secret}") String clientSecret,
            @Value("${okta.sdk.audience}") String audience
    ) throws Auth0Exception {
        AuthAPI authAPI = AuthAPI.newBuilder(domain, clientId, clientSecret).build();
        TokenRequest tokenRequest = authAPI.requestToken(audience);
        TokenHolder holder = tokenRequest.execute().getBody();
        String accessToken = holder.getAccessToken();
        return ManagementAPI.newBuilder(domain, accessToken).build();
    }
}
