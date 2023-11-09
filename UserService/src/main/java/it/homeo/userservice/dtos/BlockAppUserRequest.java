package it.homeo.userservice.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BlockAppUserRequest {
    @NotNull
    private boolean isBlocked;
}
