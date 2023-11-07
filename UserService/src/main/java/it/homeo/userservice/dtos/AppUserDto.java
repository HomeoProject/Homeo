package it.homeo.userservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppUserDto {
    private String id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String avatar;
    private boolean isBlocked;
    private boolean isOnline;
    private boolean isApproved;
    private boolean isConstructor;
    private Date createdAt;
    private Date updatedAt;
}
