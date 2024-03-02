package it.homeo.userservice.services;

import com.cloudinary.Cloudinary;
import it.homeo.userservice.config.CloudinaryProperties;
import it.homeo.userservice.dtos.response.CloudinaryDto;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService implements ICloudinaryService {

    private final CloudinaryProperties cloudinaryProperties;
    private final Cloudinary cloudinary;

    public CloudinaryService(CloudinaryProperties cloudinaryProperties, Cloudinary cloudinary) {
        this.cloudinaryProperties = cloudinaryProperties;
        this.cloudinary = cloudinary;
    }

    @Override
    public CloudinaryDto uploadFile(MultipartFile file) {
        try {
            Map<Object, Object> options = new HashMap<>();
            options.put("folder", cloudinaryProperties.getFolderName());
            var uploadedFile = cloudinary.uploader().upload(file.getBytes(), options);
            String publicId = (String) uploadedFile.get("public_id");
            String imageUrl = cloudinary.url().secure(true).generate(publicId);
            return new CloudinaryDto(publicId, imageUrl);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteFile(String publicId) {
        try {
            Map<Object, Object> options = new HashMap<>();
            options.put("folder", cloudinaryProperties.getFolderName());
            cloudinary.uploader().destroy(publicId, options);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
