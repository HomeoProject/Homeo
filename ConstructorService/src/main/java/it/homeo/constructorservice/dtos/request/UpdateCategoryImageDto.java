package it.homeo.constructorservice.dtos.request;

import org.springframework.web.multipart.MultipartFile;

public record UpdateCategoryImageDto(MultipartFile file) { }
