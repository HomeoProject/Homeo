package it.homeo.constructorservice.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.Locale;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@Configuration
public class LanguagesConfig {

    @Qualifier("languages")
    @Bean
    public Set<String> getLanguages() {
        return Arrays.stream(Locale.getISOLanguages())
                .map(Locale::new)
                .map(loc -> loc.getDisplayLanguage(Locale.ENGLISH))
                .collect(Collectors.toCollection(TreeSet::new));
    }
}
