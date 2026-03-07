package com.aifactory.techshare.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

/**
 * 文件上传配置类
 *
 * @author AI Factory
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "file.upload")
public class FileUploadConfig {

    /**
     * 文件存储路径
     */
    private String path = "D:/work/ai/CaiHmzCode/backend/uploads";

    /**
     * 最大文件大小（字节），默认5MB
     */
    private Long maxSize = 5242880L;

    /**
     * 允许的图片类型
     */
    private List<String> allowedImageTypes = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");

    /**
     * 获取允许的图片类型（小写）
     */
    public List<String> getAllowedImageTypes() {
        return allowedImageTypes.stream()
                .map(String::toLowerCase)
                .toList();
    }

    /**
     * 获取最大文件大小（MB）
     */
    public double getMaxSizeInMB() {
        return maxSize / (1024.0 * 1024.0);
    }

}
