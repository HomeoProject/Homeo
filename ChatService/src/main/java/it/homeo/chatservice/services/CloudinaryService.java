package it.homeo.chatservice.services;

import it.homeo.chatservice.dtos.response.CloudinaryDto;
import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    CloudinaryDto uploadFile(MultipartFile file);
}
