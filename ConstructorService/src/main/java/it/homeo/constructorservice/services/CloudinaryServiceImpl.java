package it.homeo.constructorservice.services;

import com.cloudinary.Cloudinary;
import it.homeo.constructorservice.config.CloudinaryProperties;
import it.homeo.constructorservice.dtos.response.CloudinaryDto;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private final CloudinaryProperties cloudinaryProperties;
    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl(CloudinaryProperties cloudinaryProperties, Cloudinary cloudinary) {
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
