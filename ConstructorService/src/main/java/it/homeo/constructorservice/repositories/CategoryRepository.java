package it.homeo.constructorservice.repositories;

import it.homeo.constructorservice.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT COUNT(con) > 0 FROM Constructor con JOIN con.categories c WHERE c.id = :categoryId")
    Boolean existsConstructorInCategory(@Param("categoryId") Long categoryId);

    Boolean existsByNameIgnoreCase(String name);
}
