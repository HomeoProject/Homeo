package it.homeo.userservice.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateAppUserPasswordRequest {
    @NotBlank
    @NotNull
    private String password;
}
