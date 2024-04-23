package it.homeo.searchservice.repositories;

import it.homeo.searchservice.dtos.request.ConstructorSearchFilterDto;
import it.homeo.searchservice.models.ConstructorSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ConstructorSearchRepository extends JpaRepository<ConstructorSearch, String> {

    @Query("SELECT c FROM ConstructorSearch c " +
            "WHERE (:#{#filterDto.getCategoryIds()} IS NULL OR EXISTS (SELECT ci FROM c.categoryIds ci WHERE ci IN :#{#filterDto.getCategoryIds()})) " +
            "AND (:#{#filterDto.getMinMinRate()} IS NULL OR c.minRate >= :#{#filterDto.getMinMinRate()}) " +
            "AND (:#{#filterDto.getMaxMinRate()} IS NULL OR c.minRate <= :#{#filterDto.getMaxMinRate()}) " +
            "AND (:#{#filterDto.getMinAverageRating()} IS NULL OR c.averageRating >= :#{#filterDto.getMinAverageRating()}) " +
            "AND (:#{#filterDto.getMaxAverageRating()} IS NULL OR c.averageRating <= :#{#filterDto.getMaxAverageRating()}) " +
            "AND (:#{#filterDto.getExactAverageRating()} IS NULL OR c.averageRating = :#{#filterDto.getExactAverageRating()}) " +
            "AND (:#{#filterDto.getIsApproved()} IS NULL OR c.isApproved = :#{#filterDto.getIsApproved()}) " +
            "AND (:#{#filterDto.getLanguages()} IS NULL OR EXISTS (SELECT l FROM c.languages l WHERE l IN :#{#filterDto.getLanguages()})) " +
            "AND (:#{#filterDto.getPaymentMethods()} IS NULL OR EXISTS (SELECT p FROM c.paymentMethods p WHERE p IN :#{#filterDto.getPaymentMethods()})) " +
            "AND (:#{#filterDto.getCities()} IS NULL OR EXISTS (SELECT ci FROM c.cities ci WHERE ci IN :#{#filterDto.getCities()})) " +
            "AND (:#{#filterDto.getGeneralSearchQuery()} IS NULL OR " +
            "LOWER(c.firstName) LIKE LOWER(concat('%', :#{#filterDto.getGeneralSearchQuery()}, '%')) OR " +
            "LOWER(c.lastName) LIKE LOWER(concat('%', :#{#filterDto.getGeneralSearchQuery()}, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(concat('%', :#{#filterDto.getGeneralSearchQuery()}, '%'))) OR " +
            "EXISTS (SELECT ci FROM c.cities ci WHERE LOWER(ci) LIKE LOWER(concat('%', :#{#filterDto.getGeneralSearchQuery()}, '%')))")
    Page<ConstructorSearch> searchConstructorSearch(@Param("filterDto") ConstructorSearchFilterDto filterDto, Pageable pageable);
}
