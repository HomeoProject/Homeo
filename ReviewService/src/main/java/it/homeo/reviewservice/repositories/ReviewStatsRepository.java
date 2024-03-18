package it.homeo.reviewservice.repositories;

import it.homeo.reviewservice.models.ReviewStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewStatsRepository extends JpaRepository<ReviewStats, Long> {
    Optional<ReviewStats> findByUserId(String userId);
    void deleteByUserId(String userId);
}
