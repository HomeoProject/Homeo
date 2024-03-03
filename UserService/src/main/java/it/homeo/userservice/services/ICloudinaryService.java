package it.homeo.userservice.services;

import it.homeo.userservice.dtos.response.CloudinaryDto;
import org.springframework.web.multipart.MultipartFile;

public interface ICloudinaryService {
    CloudinaryDto uploadFile(MultipartFile file);
    void deleteFile(String publicId);
}
