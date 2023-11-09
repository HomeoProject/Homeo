package it.homeo.userservice.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class AppUser {
    // Auth0
    @Id
    private String id;

    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String phoneNumber;

    // Auth0
    @Column(unique = true)
    private String email;

    // Auth0
    private String avatar;

    // Auth0
    private boolean isBlocked;

    private boolean isOnline;

    private boolean isApproved;

    private boolean isConstructor;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        updatedAt = createdAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
