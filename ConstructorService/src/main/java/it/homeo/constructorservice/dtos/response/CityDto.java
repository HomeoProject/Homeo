package it.homeo.constructorservice.dtos.response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class CityDto implements Serializable {
    private String name;
}
