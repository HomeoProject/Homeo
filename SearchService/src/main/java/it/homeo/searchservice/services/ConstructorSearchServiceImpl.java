package it.homeo.searchservice.services;

import it.homeo.searchservice.clients.AsyncConstructorClient;
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

import java.util.Optional;
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
    private final AsyncConstructorClient asyncConstructorClient;

    public ConstructorSearchServiceImpl(ConstructorSearchRepository constructorSearchRepository, AsyncReviewClient asyncReviewClient, AsyncUserClient asyncUserClient, AsyncConstructorClient asyncConstructorClient) {
        this.constructorSearchRepository = constructorSearchRepository;
        this.asyncReviewClient = asyncReviewClient;
        this.asyncUserClient = asyncUserClient;
        this.asyncConstructorClient = asyncConstructorClient;
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
                .exceptionally(throwable -> ReviewStatsDto.builder().reviewsNumber(0).averageRating(0D).build());

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
    public void addConstructorSearch(AppUserDto dto) {
        /*
        We don't handle exceptions exceptionally here because if the provided ID doesn't correspond to a constructor,
        we don't want to proceed with adding it to the system
         */
        CompletableFuture<ConstructorDto> constructorFuture = asyncConstructorClient.getConstructorAsync(dto.id());
        CompletableFuture<ReviewStatsDto> reviewFuture = asyncReviewClient.getUserReviewStatsAsync(dto.id())
                .exceptionally(throwable -> ReviewStatsDto.builder().reviewsNumber(0).averageRating(0D).build());

        CompletableFuture.allOf(constructorFuture, reviewFuture)
                .thenAccept(ignoredVoid -> { // In Java 21+ you can use _
                    try {
                        ConstructorDto constructorDto = constructorFuture.get();
                        ReviewStatsDto reviewStatsDto = reviewFuture.get();
                        ConstructorSearch constructorSearch = setConstructorSearch(constructorDto, dto, reviewStatsDto);
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
        Optional<ConstructorSearch> constructorSearchOptional = constructorSearchRepository.findById(dto.userId());

        if (constructorSearchOptional.isPresent()) {
            ConstructorSearch constructorSearch = constructorSearchOptional.get();
            constructorSearch.setMinRate(dto.minRate());
            constructorSearch.setEmail(dto.constructorEmail());
            constructorSearch.setPhoneNumber(dto.phoneNumber());
            constructorSearch.setLanguages(dto.languages());
            constructorSearch.setCities(dto.cities());
            constructorSearch.setPaymentMethods(dto.paymentMethods());
            Set<Long> categoryIds = getCategoryIds(dto);
            constructorSearch.setCategoryIds(categoryIds);
            constructorSearchRepository.save(constructorSearch);
        } else {
            // Re-adds it if it's not there, because it should be there
            addConstructorSearch(dto);
        }
    }

    @Override
    public void updateConstructorSearch(AppUserDto dto) {
        Optional<ConstructorSearch> constructorSearchOptional = constructorSearchRepository.findById(dto.id());

        if (constructorSearchOptional.isPresent()) {
            ConstructorSearch constructorSearch = constructorSearchOptional.get();
            constructorSearch.setFirstName(dto.firstName());
            constructorSearch.setLastName(dto.lastName());
            constructorSearch.setIsApproved(dto.isApproved());
            constructorSearch.setAvatar(dto.avatar());
            constructorSearchRepository.save(constructorSearch);
        }
    }

    @Override
    public void updateConstructorSearch(ReviewStatsDto dto) {
        Optional<ConstructorSearch> constructorSearchOptional = constructorSearchRepository.findById(dto.userId());

        if (constructorSearchOptional.isPresent()) {
            ConstructorSearch constructorSearch = constructorSearchOptional.get();
            constructorSearch.setAverageRating(dto.averageRating());
            constructorSearch.setReviewsNumber(dto.reviewsNumber());
            constructorSearchRepository.save(constructorSearch);
        }
    }

    @Override
    public void deleteConstructorSearch(String userId) {
        Optional<ConstructorSearch> constructorSearchOptional = constructorSearchRepository.findById(userId);
        constructorSearchOptional.ifPresent(constructorSearchRepository::delete);
    }

    private ConstructorSearch setConstructorSearch(ConstructorDto constructorDto, AppUserDto appUserDto, ReviewStatsDto reviewStatsDto) {
        ConstructorSearch constructorSearch = new ConstructorSearch();
        constructorSearch.setUserId(constructorDto.userId());
        constructorSearch.setFirstName(appUserDto.firstName());
        constructorSearch.setLastName(appUserDto.lastName());
        constructorSearch.setIsApproved(appUserDto.isApproved());
        constructorSearch.setAvatar(appUserDto.avatar());
        constructorSearch.setMinRate(constructorDto.minRate());
        constructorSearch.setEmail(constructorDto.constructorEmail());
        constructorSearch.setPhoneNumber(constructorDto.phoneNumber());
        constructorSearch.setAverageRating(reviewStatsDto.averageRating());
        constructorSearch.setReviewsNumber(reviewStatsDto.reviewsNumber());
        constructorSearch.setLanguages(constructorDto.languages());
        constructorSearch.setCities(constructorDto.cities());
        constructorSearch.setPaymentMethods(constructorDto.paymentMethods());
        Set<Long> categoryIds = getCategoryIds(constructorDto);
        constructorSearch.setCategoryIds(categoryIds);
        return constructorSearch;
    }

    private Set<Long> getCategoryIds(ConstructorDto dto) {
        return dto.categories().stream()
                .map(CategoryDto::id)
                .collect(Collectors.toSet());
    }
}
