package it.homeo.categoryservice.repositories;

import it.homeo.categoryservice.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByOrderByNameAsc();
    Boolean existsByNameIgnoreCase(String name);
}
