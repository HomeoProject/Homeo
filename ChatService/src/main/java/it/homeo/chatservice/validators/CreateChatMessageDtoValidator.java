package it.homeo.chatservice.validators;

import it.homeo.chatservice.dtos.request.CreateChatMessageDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import java.util.Set;

public class CreateChatMessageDtoValidator {
    public static boolean isValid(CreateChatMessageDto dto) {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<CreateChatMessageDto>> violations = validator.validate(dto);
            return violations.isEmpty();
        } catch (Exception ex) {
            return false;
        }
    }
}
