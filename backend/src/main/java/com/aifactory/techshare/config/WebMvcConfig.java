package com.aifactory.techshare.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC 配置类
 * 配置静态资源映射
 *
 * @author AI Factory
 */
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final FileUploadConfig fileUploadConfig;

    /**
     * 配置静态资源映射
     * 将 /uploads/** 映射到本地文件目录
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 获取上传路径，确保以 file: 协议开头
        String uploadPath = fileUploadConfig.getPath();
        // 替换路径中的反斜杠为正斜杠，并确保以 file:/ 开头
        String resourceLocation = "file:///" + uploadPath.replace("\\", "/") + "/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation);

        WebMvcConfigurer.super.addResourceHandlers(registry);
    }

}
