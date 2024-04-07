package it.homeo.searchservice.services;

import it.homeo.searchservice.dtos.request.AppUserDto;
import it.homeo.searchservice.dtos.request.ConstructorDto;
import it.homeo.searchservice.dtos.request.ConstructorSearchFilterDto;
import it.homeo.searchservice.dtos.request.ReviewStatsDto;
import it.homeo.searchservice.models.ConstructorSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ConstructorSearchService {
    Page<ConstructorSearch> searchConstructorsSearch(ConstructorSearchFilterDto dto, Pageable pageable);
    void addConstructorSearch(ConstructorDto dto);
    void addConstructorSearch(AppUserDto dto);
    void updateConstructorSearch(ConstructorDto dto);
    void updateConstructorSearch(AppUserDto dto);
    void updateConstructorSearch(ReviewStatsDto dto);
    void deleteConstructorSearch(String userId);
}
