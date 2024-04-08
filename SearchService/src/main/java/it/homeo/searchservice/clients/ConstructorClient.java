package it.homeo.searchservice.clients;

import it.homeo.searchservice.dtos.request.ConstructorDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ConstructorService", url = "${feign.client.urls.ConstructorService}")
public interface ConstructorClient {

    @GetMapping("/api/constructors/{userId}")
    ConstructorDto getConstructor(@PathVariable("userId") String userId);
}
