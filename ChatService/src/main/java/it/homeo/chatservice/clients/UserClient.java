package it.homeo.chatservice.clients;

import it.homeo.chatservice.dtos.request.AppUserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "UserService", url = "${feign.client.urls.UserService}")
public interface UserClient {

    @GetMapping("/api/users/{id}")
    AppUserDto getAppUserById(@PathVariable("id") String id);
}
