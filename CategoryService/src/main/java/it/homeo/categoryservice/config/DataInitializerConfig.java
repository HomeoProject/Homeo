package it.homeo.categoryservice.config;

import it.homeo.categoryservice.dtos.AddCategoryRequestDto;
import it.homeo.categoryservice.exceptions.CategoryAlreadyExistsException;
import it.homeo.categoryservice.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile("!test")
@Configuration
public class DataInitializerConfig {

    @Bean
    public CommandLineRunner categoryInitializerRunner(@Autowired CategoryService service, @Value("${categories}") String[] categoriesNames) {
        return args -> {
            for (String name : categoriesNames) {
                try {
                    service.addCategory(new AddCategoryRequestDto(name));
                } catch (CategoryAlreadyExistsException ex) {
                    System.out.println(ex.getMessage());
                }
            }
        };
    }
}
