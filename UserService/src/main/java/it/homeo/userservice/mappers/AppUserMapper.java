package it.homeo.userservice.mappers;

import it.homeo.userservice.dtos.AppUserDto;
import it.homeo.userservice.models.AppUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


/*
Setting componentModel = "spring" in a MapStruct interface means that
MapStruct will generate an implementation class for the interface as a Spring-managed component (typically a Spring Bean).
This allows you to easily inject and use the mapping in other Spring components.
*/
@Mapper(componentModel = "spring")
public interface AppUserMapper {
    @Mapping(target = "id", source = "id")
    AppUserDto appUserToAppUserDto(AppUser appUser);
}
