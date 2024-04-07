package it.homeo.searchservice.enums;

import lombok.Getter;

@Getter
public enum PaymentMethod {
    CASH(1),
    CARD(2),
    TRANSFER(3);

    private final int value;

    PaymentMethod(int value) {
        this.value = value;
    }
}
