package it.homeo.constructorservice.services;

import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.exception.Auth0Exception;
import it.homeo.constructorservice.config.Auth0RolesProperties;
import it.homeo.constructorservice.exceptions.AlreadyExistsException;
import it.homeo.constructorservice.exceptions.NotFoundException;
import it.homeo.constructorservice.messaging.ConstructorEventProducer;
import it.homeo.constructorservice.models.Constructor;
import it.homeo.constructorservice.repositories.ConstructorRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class ConstructorServiceImpl implements ConstructorService {

    private final ConstructorRepository constructorRepository;
    private final Auth0RolesProperties auth0RolesProperties;
    private final ManagementAPI mgmt;
    private final ConstructorEventProducer constructorEventProducer;

    public ConstructorServiceImpl(ConstructorRepository constructorRepository, Auth0RolesProperties auth0RolesProperties, ManagementAPI mgmt, ConstructorEventProducer constructorEventProducer) {
        this.constructorRepository = constructorRepository;
        this.auth0RolesProperties = auth0RolesProperties;
        this.mgmt = mgmt;
        this.constructorEventProducer = constructorEventProducer;
    }

    @Override
    public Constructor getConstructorByUserId(String userId) {
        return constructorRepository
                .findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Constructor with userId: " + userId + " not found"));
    }

    @Override
    public Constructor addConstructor(Constructor constructor) throws Auth0Exception {
        if (constructorRepository.existsByUserId(constructor.getUserId())) {
            throw new AlreadyExistsException("Constructor with userId: " + constructor.getUserId() + " already exists");
        }
        if (constructorRepository.existsByConstructorEmail(constructor.getConstructorEmail())) {
            throw new AlreadyExistsException("Constructor with constructor email: " + constructor.getConstructorEmail() + " already exists");
        }
        if (constructorRepository.existsByPhoneNumber(constructor.getPhoneNumber())) {
            throw new AlreadyExistsException("Constructor with phone number: " + constructor.getPhoneNumber()+ " already exists");
        }
        constructor = constructorRepository.save(constructor);
        mgmt.users().addRoles(constructor.getUserId(), Collections.singletonList(auth0RolesProperties.getConstructorRoleId())).execute();
        constructorEventProducer.produceConstructorAddedEvent(constructor);
        return constructor;
    }

    @Override
    public Constructor updateConstructorByUserId(String userId, Constructor newConstructor) {
        Constructor constructor = getConstructorByUserId(userId);
        if (!constructor.getConstructorEmail().equals(newConstructor.getConstructorEmail()) && constructorRepository.existsByConstructorEmail(newConstructor.getConstructorEmail())) {
            throw new AlreadyExistsException("Constructor with constructor email: " + newConstructor.getConstructorEmail() + " already exists");
        }
        if (!constructor.getPhoneNumber().equals(newConstructor.getPhoneNumber()) && constructorRepository.existsByPhoneNumber(newConstructor.getPhoneNumber())) {
            throw new AlreadyExistsException("Constructor with phone number: " + newConstructor.getPhoneNumber()+ " already exists");
        }
        constructor.setAboutMe(newConstructor.getAboutMe());
        constructor.setExperience(newConstructor.getExperience());
        constructor.setMinRate(newConstructor.getMinRate());
        constructor.setPhoneNumber(newConstructor.getPhoneNumber());
        constructor.setConstructorEmail(newConstructor.getConstructorEmail());
        constructor.setLanguages(newConstructor.getLanguages());
        constructor.setCities(newConstructor.getCities());
        constructor.setCategories(newConstructor.getCategories());
        constructor.setPaymentMethods(newConstructor.getPaymentMethods());
        constructor = constructorRepository.save(constructor);
        constructorEventProducer.produceConstructorUpdatedEvent(constructor);
        return constructor;
    }

    @Override
    public void deleteConstructorByUserId(String userId) throws Auth0Exception {
        Constructor constructor = getConstructorByUserId(userId);
        mgmt.users().removeRoles(constructor.getUserId(), Collections.singletonList(auth0RolesProperties.getConstructorRoleId())).execute();
        constructorEventProducer.produceConstructorDeletedEvent(userId);
        constructorRepository.delete(constructor);
    }
}
