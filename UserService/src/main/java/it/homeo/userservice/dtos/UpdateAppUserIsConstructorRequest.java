package it.homeo.userservice.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateAppUserIsConstructorRequest {
    @NotNull
    private boolean isConstructor;
}
