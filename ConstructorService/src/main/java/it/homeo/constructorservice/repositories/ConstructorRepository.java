package it.homeo.constructorservice.repositories;

import it.homeo.constructorservice.models.Constructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConstructorRepository extends JpaRepository<Constructor, Long> {
    Optional<Constructor> findByUserId(String userId);
    Boolean existsByUserId(String userId);
    Boolean existsByPhoneNumber(String phoneNumber);
    Boolean existsByConstructorEmail(String email);
}
