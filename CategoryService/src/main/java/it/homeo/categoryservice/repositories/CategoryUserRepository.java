package it.homeo.categoryservice.repositories;

import it.homeo.categoryservice.models.Category;
import it.homeo.categoryservice.models.CategoryUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryUserRepository extends JpaRepository<CategoryUser, Long> {
    Boolean existsCategoryUserByCategoryAndUserId(Category category, String userId);
    Optional<CategoryUser> findByCategoryAndUserId(Category category, String userId);
    List<CategoryUser> findByUserId(String userId);
    void deleteAllByUserId(String userId);
}
