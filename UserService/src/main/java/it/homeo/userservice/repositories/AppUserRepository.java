package it.homeo.userservice.repositories;

import it.homeo.userservice.dtos.request.AppUserFilterDto;
import it.homeo.userservice.models.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, String> {

    @Query("SELECT a FROM AppUser a WHERE a.isDeleted = false " +
            "AND ((:#{#dto.id()}) IS NULL OR LOWER(a.id) LIKE LOWER(concat('%', :#{#dto.id()}, '%' ))) " +
            "AND ((:#{#dto.firstName()}) IS NULL OR LOWER(a.firstName) LIKE LOWER(concat('%', :#{#dto.firstName()}, '%' ))) " +
            "AND ((:#{#dto.lastName()}) IS NULL OR LOWER(a.lastName) LIKE LOWER(concat('%', :#{#dto.lastName()}, '%' ))) " +
            "AND ((:#{#dto.phoneNumber()}) IS NULL OR LOWER(a.phoneNumber) LIKE LOWER(concat('%', :#{#dto.phoneNumber()}, '%' ))) " +
            "AND ((:#{#dto.email()}) IS NULL OR LOWER(a.email) LIKE LOWER(concat('%', :#{#dto.email()}, '%' )))")
    Page<AppUser> searchAppUsers(@Param("dto")AppUserFilterDto dto, Pageable pageable);
}
