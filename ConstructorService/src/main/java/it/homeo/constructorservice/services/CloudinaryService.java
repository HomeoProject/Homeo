package it.homeo.constructorservice.services;

import it.homeo.constructorservice.dtos.response.CloudinaryDto;
import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    CloudinaryDto uploadFile(MultipartFile file);
    void deleteFile(String publicId);
}
