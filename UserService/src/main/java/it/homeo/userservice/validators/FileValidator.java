package it.homeo.userservice.validators;

import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

public class FileValidator {
    public static boolean isImage(MultipartFile file) {
        String type = Objects.requireNonNull(file.getContentType()).split("/")[0];
        return type.equals("image");
    }
}
