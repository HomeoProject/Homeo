package it.homeo.searchservice.models;

import it.homeo.searchservice.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
public class ConstructorSearch {
    @Id
    private String userId;

    private String firstName;

    private String lastName;

    private Boolean isApproved;

    private String avatar;

    private Integer minRate;

    private Double averageRating;

    private Integer reviewsNumber;

    @ElementCollection
    @CollectionTable(name = "languages", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "language", nullable = false)
    private Set<String> languages;

    @ElementCollection
    @CollectionTable(name = "cities", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "city", nullable = false)
    private Set<String> cities;

    @ElementCollection(targetClass = PaymentMethod.class)
    @CollectionTable(name = "payment_methods", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "payment_method", nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private Set<PaymentMethod> paymentMethods;

    @ElementCollection
    @CollectionTable(name = "categoryIds", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "categoryId", nullable = false)
    private Set<Long> categoryIds;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        ConstructorSearch that = (ConstructorSearch) o;
        return getUserId() != null && Objects.equals(getUserId(), that.getUserId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
