package it.homeo.constructorservice.repositories;

import it.homeo.constructorservice.models.Constructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConstructorRepository extends JpaRepository<Constructor, Long> { }
