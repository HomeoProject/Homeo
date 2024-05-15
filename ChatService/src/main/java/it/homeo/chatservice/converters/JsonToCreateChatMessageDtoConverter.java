package it.homeo.chatservice.converters;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.homeo.chatservice.dtos.request.CreateChatMessageDto;
import jakarta.annotation.Nonnull;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JsonToCreateChatMessageDtoConverter implements Converter<String, CreateChatMessageDto> {

    private final ObjectMapper objectMapper;

    public JsonToCreateChatMessageDtoConverter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public CreateChatMessageDto convert(@Nonnull String source) {
        try {
            return objectMapper.readValue(source, CreateChatMessageDto.class);
        } catch (IOException e) {
            throw new IllegalArgumentException("Error converting JSON to CreateChatMessageDto", e);
        }
    }
}
