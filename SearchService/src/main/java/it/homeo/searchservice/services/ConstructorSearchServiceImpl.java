package it.homeo.searchservice.services;

import it.homeo.searchservice.clients.AsyncReviewClient;
import it.homeo.searchservice.clients.AsyncUserClient;
import it.homeo.searchservice.dtos.request.*;
import it.homeo.searchservice.models.ConstructorSearch;
import it.homeo.searchservice.repositories.ConstructorSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ConstructorSearchServiceImpl implements ConstructorSearchService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ConstructorSearchServiceImpl.class);
    private final ConstructorSearchRepository constructorSearchRepository;
    private final AsyncReviewClient asyncReviewClient;
    private final AsyncUserClient asyncUserClient;


    public ConstructorSearchServiceImpl(ConstructorSearchRepository constructorSearchRepository, AsyncReviewClient asyncReviewClient, AsyncUserClient asyncUserClient) {
        this.constructorSearchRepository = constructorSearchRepository;
        this.asyncReviewClient = asyncReviewClient;
        this.asyncUserClient = asyncUserClient;
    }

    @Override
    public Page<ConstructorSearch> searchConstructorsSearch(ConstructorSearchFilterDto dto, Pageable pageable) {
        return null;
    }

    @Override
    public void addConstructorSearch(ConstructorDto dto) {
        CompletableFuture<AppUserDto> userFuture = asyncUserClient.getAppUserByIdAsync(dto.userId())
                .exceptionally(throwable -> AppUserDto.builder().build());
        CompletableFuture<ReviewStatsDto> reviewFuture = asyncReviewClient.getUserReviewStatsAsync(dto.userId())
                .exceptionally(throwable -> ReviewStatsDto.builder().reviewsNumber(0).build());

        CompletableFuture.allOf(userFuture, reviewFuture)
                .thenAccept(ignoredVoid -> { // In Java 21+ you can use _
                    try {
                        AppUserDto appUserDto = userFuture.get();
                        ReviewStatsDto reviewStatsDto = reviewFuture.get();
                        ConstructorSearch constructorSearch = setConstructorSearch(dto, appUserDto, reviewStatsDto);
                        constructorSearchRepository.save(constructorSearch);
                    } catch (ExecutionException | InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                })
                .exceptionally(throwable -> {
                    LOGGER.error("Inside: ConstructorSearchServiceImpl -> addConstructorSearch()...: {}", throwable.getMessage());
                    return null;
                });
    }

    @Override
    public void updateConstructorSearch(ConstructorDto dto) {

    }

    @Override
    public void updateConstructorSearch(AppUserDto dto) {

    }

    @Override
    public void updateConstructorSearch(ReviewStatsDto dto) {

    }

    @Override
    public void deleteConstructorSearch(String userId) {

    }

    private ConstructorSearch setConstructorSearch(ConstructorDto constructorDto, AppUserDto appUserDto, ReviewStatsDto reviewStatsDto) {
        ConstructorSearch constructorSearch = new ConstructorSearch();
        constructorSearch.setUserId(constructorDto.userId());
        constructorSearch.setFirstName(appUserDto.firstName());
        constructorSearch.setLastName(appUserDto.lastName());
        constructorSearch.setIsApproved(appUserDto.isApproved());
        constructorSearch.setAvatar(appUserDto.avatar());
        constructorSearch.setMinRate(constructorDto.minRate());
        constructorSearch.setAverageRating(reviewStatsDto.averageRating());
        constructorSearch.setReviewsNumber(reviewStatsDto.reviewsNumber());
        constructorSearch.setLanguages(constructorDto.languages());
        constructorSearch.setCities(constructorDto.cities());
        constructorSearch.setPaymentMethods(constructorDto.paymentMethods());

        Set<Long> categoryIds = constructorDto.categories().stream()
                .map(CategoryDto::id)
                .collect(Collectors.toSet());

        constructorSearch.setCategoryIds(categoryIds);

        return constructorSearch;
    }
}
