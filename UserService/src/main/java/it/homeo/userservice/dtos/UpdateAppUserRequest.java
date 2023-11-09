package it.homeo.userservice.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateAppUserRequest {
    @NotBlank
    @NotNull
    private String firstName;

    @NotBlank
    @NotNull
    private String lastName;

    @NotBlank
    @NotNull
    private String phoneNumber;
}
