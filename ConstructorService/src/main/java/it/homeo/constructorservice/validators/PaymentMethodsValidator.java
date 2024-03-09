package it.homeo.constructorservice.validators;

import it.homeo.constructorservice.enums.PaymentMethod;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.EnumSet;
import java.util.Set;

public class PaymentMethodsValidator implements ConstraintValidator<ValidPaymentMethods, Set<PaymentMethod>> {

    @Override
    public void initialize(ValidPaymentMethods constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(Set<PaymentMethod> values, ConstraintValidatorContext context) {
        if (values == null || values.isEmpty()) {
            return false;
        }

        Set<PaymentMethod> availablePaymentMethods = EnumSet.allOf(PaymentMethod.class);
        return availablePaymentMethods.containsAll(values);
    }
}
