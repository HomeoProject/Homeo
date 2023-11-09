package it.homeo.userservice.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApproveAppUserRequest {
    @NotNull
    private boolean isApproved;
}
