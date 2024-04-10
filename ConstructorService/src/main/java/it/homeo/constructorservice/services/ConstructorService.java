package it.homeo.constructorservice.services;

import com.auth0.exception.Auth0Exception;
import it.homeo.constructorservice.models.Constructor;

public interface ConstructorService {
    Constructor getConstructorByUserId(String userId);
    Constructor addConstructor(Constructor constructor) throws Auth0Exception;
    Constructor updateConstructorByUserId(String userId, Constructor newConstructor);
    void deleteConstructorByUserId(String userId) throws Auth0Exception;
}
