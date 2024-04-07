package it.homeo.searchservice.clients;

import it.homeo.searchservice.dtos.request.AppUserDto;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class AsyncUserClient {

    private final UserClient userClient;

    public AsyncUserClient(UserClient userClient) {
        this.userClient = userClient;
    }

    @Async
    public CompletableFuture<AppUserDto> getAppUserByIdAsync(String id) {
        return CompletableFuture.completedFuture(userClient.getAppUserById(id));
    }
}
