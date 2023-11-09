package it.homeo.userservice.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckAppUserAfterLoginRequest {
    @NotBlank
    private String id;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String avatar;

    @NotNull
    private boolean isBlocked;
}
