package it.homeo.searchservice.clients;

import it.homeo.searchservice.dtos.request.ConstructorDto;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class AsyncConstructorClient {

    private final ConstructorClient constructorClient;

    public AsyncConstructorClient(ConstructorClient constructorClient) {
        this.constructorClient = constructorClient;
    }

    @Async
    public CompletableFuture<ConstructorDto> getConstructorAsync(String userId) {
        return CompletableFuture.completedFuture(constructorClient.getConstructor(userId));
    }
}
