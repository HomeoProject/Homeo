package it.homeo.userservice.dtos.request;

import org.springframework.web.multipart.MultipartFile;

public record UpdateAppUserAvatarRequest(MultipartFile file) { }
