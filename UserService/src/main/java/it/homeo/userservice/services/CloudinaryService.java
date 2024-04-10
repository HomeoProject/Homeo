package it.homeo.userservice.services;

import it.homeo.userservice.dtos.response.CloudinaryDto;
import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    CloudinaryDto uploadFile(MultipartFile file);
    void deleteFile(String publicId);
}
