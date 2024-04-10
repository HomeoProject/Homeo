package it.homeo.constructorservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = CloudinaryProperties.PREFIX)
public class CloudinaryProperties {
    public static final String PREFIX = "cloudinary";
    private String apiKey;
    private String cloudName;
    private String apiSecret;
    private String folderName;
    private String defaultCategoryImage;
}
