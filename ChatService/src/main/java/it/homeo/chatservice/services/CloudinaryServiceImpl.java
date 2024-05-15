package it.homeo.chatservice.services;

import com.cloudinary.Cloudinary;
import it.homeo.chatservice.config.CloudinaryProperties;
import it.homeo.chatservice.dtos.response.CloudinaryDto;
import org.springframework.stereotype.Service;

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
    public CloudinaryDto uploadFile(byte[] bytes) {
        try {
            Map<Object, Object> options = new HashMap<>();
            options.put("folder", cloudinaryProperties.getFolderName());
            var uploadedFile = cloudinary.uploader().upload(bytes, options);
            String publicId = (String) uploadedFile.get("public_id");
            String imageUrl = cloudinary.url().secure(true).generate(publicId);
            return new CloudinaryDto(publicId, imageUrl);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
