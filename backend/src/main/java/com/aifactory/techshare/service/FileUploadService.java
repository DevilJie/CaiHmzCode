package com.aifactory.techshare.service;

import com.aifactory.techshare.config.FileUploadConfig;
import com.aifactory.techshare.dto.UploadResponse;
import com.aifactory.techshare.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * 文件上传服务
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final FileUploadConfig fileUploadConfig;

    /**
     * 上传图片
     *
     * @param file 图片文件
     * @return 上传响应
     */
    public UploadResponse uploadImage(MultipartFile file) {
        // 校验文件
        validateFile(file);
        validateImageType(file);

        // 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String newFilename = UUID.randomUUID().toString() + "." + extension;

        // 确保上传目录存在
        Path uploadPath = Paths.get(fileUploadConfig.getPath());
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("创建上传目录: {}", uploadPath.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("创建上传目录失败: {}", e.getMessage());
            throw new BusinessException("创建上传目录失败");
        }

        // 保存文件
        Path filePath = uploadPath.resolve(newFilename);
        try {
            file.transferTo(filePath.toFile());
            log.info("文件上传成功: {}", filePath.toAbsolutePath());
        } catch (IOException e) {
            log.error("文件保存失败: {}", e.getMessage());
            throw new BusinessException("文件保存失败");
        }

        // 构建响应
        return UploadResponse.builder()
                .url("/uploads/" + newFilename)
                .filename(originalFilename)
                .size(file.getSize())
                .build();
    }

    /**
     * 校验文件基本信息
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("请选择要上传的文件");
        }

        // 校验文件大小
        if (file.getSize() > fileUploadConfig.getMaxSize()) {
            String maxSizeMB = String.format("%.1f", fileUploadConfig.getMaxSizeInMB());
            throw new BusinessException("文件大小超过限制，最大允许 " + maxSizeMB + "MB");
        }
    }

    /**
     * 校验图片类型
     */
    private void validateImageType(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new BusinessException("文件名不能为空");
        }

        String extension = getFileExtension(originalFilename);
        if (extension == null || extension.isBlank()) {
            throw new BusinessException("无法识别文件类型");
        }

        // 校验文件扩展名
        if (!fileUploadConfig.getAllowedImageTypes().contains(extension.toLowerCase())) {
            String allowedTypes = String.join(", ", fileUploadConfig.getAllowedImageTypes());
            throw new BusinessException("不支持的文件类型，仅支持: " + allowedTypes);
        }

        // 校验文件Content-Type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException("请上传图片文件");
        }
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isBlank()) {
            return null;
        }
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return null;
        }
        return filename.substring(lastDotIndex + 1);
    }

    /**
     * 删除文件
     *
     * @param filename 文件名
     * @return 是否删除成功
     */
    public boolean deleteFile(String filename) {
        if (filename == null || filename.isBlank()) {
            return false;
        }

        Path filePath = Paths.get(fileUploadConfig.getPath(), filename);
        File file = filePath.toFile();

        if (file.exists() && file.isFile()) {
            boolean deleted = file.delete();
            if (deleted) {
                log.info("文件删除成功: {}", filePath.toAbsolutePath());
            } else {
                log.warn("文件删除失败: {}", filePath.toAbsolutePath());
            }
            return deleted;
        }

        return false;
    }

}
