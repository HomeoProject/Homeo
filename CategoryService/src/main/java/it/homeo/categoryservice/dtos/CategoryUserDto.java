package it.homeo.categoryservice.dtos;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonSerialize
public record CategoryUserDto(
        @JsonProperty("userId")
        String userId,

        @JsonProperty("categoryId")
        Long categoryId,

        @JsonProperty("categoryName")
        String categoryName
) { }
