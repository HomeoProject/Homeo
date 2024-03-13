package it.homeo.constructorservice.validators;

import it.homeo.constructorservice.dtos.response.CityDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Set;

public class CitiesValidator implements ConstraintValidator<ValidCities, Set<String>> {

    @Value("${api-ninjas.url}")
    private String apiUrl;

    @Value("${api-ninjas.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public CitiesValidator(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public void initialize(ValidCities constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(Set<String> value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty() || value.size() > 6) {
            return false;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Api-Key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        for (String city : value) {
            String url = apiUrl + "?name=" + city + "&country=PL&limit=5";
            ResponseEntity<CityDto[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, CityDto[].class);

            CityDto[] cityDtos = response.getBody();
            if (cityDtos == null || cityDtos.length == 0) {
                return false;
            }

            boolean cityFound = false;
            for (CityDto cityDto : cityDtos) {
                if (cityDto.getName().equals(city)) {
                    cityFound = true;
                    break;
                }
            }

            if (!cityFound) {
                return false;
            }
        }

        return true;
    }
}
