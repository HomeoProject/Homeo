package it.homeo.constructorservice.config;

import it.homeo.constructorservice.exceptions.AlreadyExistsException;
import it.homeo.constructorservice.models.Category;
import it.homeo.constructorservice.services.CategoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(prefix = "category.initializer", name = "enabled", havingValue = "true", matchIfMissing = true)
public class CategoryInitializer implements CommandLineRunner {

    @Value("${init.categories}")
    private String[] categoryNames;

    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryInitializer.class);
    private final CategoryService categoryService;

    public CategoryInitializer(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Override
    public void run(String... args) {
        for (String name : categoryNames) {
            try {
                Category category = new Category();
                category.setName(name);
                category.setDescription("%s category description".formatted(name));
                categoryService.addCategory(category);
                LOGGER.info("Inside: CategoryInitializer -> Category with name: '%s' added".formatted(name));
            } catch (AlreadyExistsException e) {
                LOGGER.warn("Inside: CategoryInitializer -> '%s'".formatted(e.getMessage()));
            }
        }
    }
}
