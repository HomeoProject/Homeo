package it.homeo.searchservice.repositories;

import it.homeo.searchservice.models.ConstructorSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConstructorSearchRepository extends JpaRepository<ConstructorSearch, String> { }
