package it.homeo.chatservice.services;

import it.homeo.chatservice.dtos.response.CloudinaryDto;

public interface CloudinaryService {
    CloudinaryDto uploadFile(byte[] bytes);
}
