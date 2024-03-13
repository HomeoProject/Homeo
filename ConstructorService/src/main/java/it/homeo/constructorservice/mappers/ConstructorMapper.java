package it.homeo.constructorservice.mappers;

import it.homeo.constructorservice.dtos.request.AddConstructorDto;
import it.homeo.constructorservice.dtos.request.UpdateConstructorDto;
import it.homeo.constructorservice.dtos.response.ConstructorDto;
import it.homeo.constructorservice.enums.PaymentMethod;
import it.homeo.constructorservice.models.Category;
import it.homeo.constructorservice.models.Constructor;
import it.homeo.constructorservice.services.CategoryService;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ConstructorMapper {

    private final CategoryMapper categoryMapper;
    private final CategoryService categoryService;

    public ConstructorMapper(CategoryMapper categoryMapper, CategoryService categoryService) {
        this.categoryMapper = categoryMapper;
        this.categoryService = categoryService;
    }

    public ConstructorDto toDto(Constructor constructor) {
        return ConstructorDto.builder()
                .id(constructor.getId())
                .userId(constructor.getUserId())
                .aboutMe(constructor.getAboutMe())
                .experience(constructor.getExperience())
                .minRate(constructor.getMinRate())
                .phoneNumber(constructor.getPhoneNumber())
                .constructorEmail(constructor.getConstructorEmail())
                .languages(constructor.getLanguages())
                .categories(constructor.getCategories().stream().map(categoryMapper::toDto).collect(Collectors.toSet()))
                .cities(constructor.getCities())
                .paymentMethods(constructor.getPaymentMethods())
                .createdAt(constructor.getCreatedAt())
                .updatedAt(constructor.getUpdatedAt())
                .build();
    }

    public Constructor toEntity(AddConstructorDto dto, String userId) {
        Set<Category> categories = categoryService.getCategoriesFromIds(dto.categoryIds());
        Constructor constructor = getConstructor(categories, dto.aboutMe(), dto.experience(), dto.minRate(), dto.phoneNumber(), dto.constructorEmail(), dto.languages(), dto.cities(), dto.paymentMethods());
        constructor.setUserId(userId);
        return constructor;
    }

    public Constructor toEntity(UpdateConstructorDto dto) {
        Set<Category> categories = categoryService.getCategoriesFromIds(dto.categoryIds());
        return getConstructor(categories, dto.aboutMe(), dto.experience(), dto.minRate(), dto.phoneNumber(), dto.constructorEmail(), dto.languages(), dto.cities(), dto.paymentMethods());
    }

    @NotNull
    private Constructor getConstructor(Set<Category> categories, String aboutMe, String experience, Integer integer, String phoneNumber, String email, Set<String> languages, Set<String> cities, Set<PaymentMethod> paymentMethods) {
        Constructor constructor = new Constructor();
        constructor.setAboutMe(aboutMe);
        constructor.setExperience(experience);
        constructor.setMinRate(integer);
        constructor.setPhoneNumber(phoneNumber);
        constructor.setConstructorEmail(email);
        constructor.setLanguages(languages);
        constructor.setCities(cities);
        constructor.setCategories(categories);
        constructor.setPaymentMethods(paymentMethods);
        return constructor;
    }
}
