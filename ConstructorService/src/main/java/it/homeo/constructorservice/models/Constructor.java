package it.homeo.constructorservice.models;

import it.homeo.constructorservice.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(indexes = {
        @Index(name = "idx_user_id", columnList = "userId", unique = true)
})
public class Constructor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "userId", nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String aboutMe;

    @Column(nullable = false)
    private String experience;

    @Column(nullable = false)
    private Integer minRate;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false, unique = true)
    private String constructorEmail;

    @ElementCollection
    @CollectionTable(name = "languages", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "language", nullable = false, length = 6)
    private Set<String> languages;

    @ElementCollection
    @CollectionTable(name = "cities", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "city", nullable = false, length = 6)
    private Set<String> cities;

    @OneToMany(cascade = {CascadeType.REFRESH})
    @Column(nullable = false, length = 10)
    @ToString.Exclude
    private Set<Category> categories;

    @ElementCollection(targetClass = PaymentMethod.class)
    @CollectionTable(name = "payment_methods", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "payment_method", nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private Set<PaymentMethod> paymentMethods;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        updatedAt = createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Constructor that = (Constructor) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
