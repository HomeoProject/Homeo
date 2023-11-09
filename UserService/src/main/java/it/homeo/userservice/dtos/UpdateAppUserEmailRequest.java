package it.homeo.userservice.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateAppUserEmailRequest {
    @NotBlank
    @Email
    private String email;
}
