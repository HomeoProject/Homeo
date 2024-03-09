package it.homeo.constructorservice.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PaymentMethodsValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPaymentMethods {
    String message() default "Invalid payment method";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
