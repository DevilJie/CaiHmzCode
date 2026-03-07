package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.UploadResponse;
import com.aifactory.techshare.service.FileUploadService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/admin/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileUploadService fileUploadService;

    /**
     * 上传图片
     * 支持jpg/png/gif/webp格式，最大5MB
     *
     * @param file 图片文件
     * @return 上传结果
     */
    @PostMapping("/image")
    public Result<UploadResponse> uploadImage(
            @RequestParam("file") @NotNull MultipartFile file) {
        log.info("开始上传图片: {}, 大小: {} bytes", file.getOriginalFilename(), file.getSize());

        UploadResponse response = fileUploadService.uploadImage(file);

        log.info("图片上传成功: {}", response.getUrl());
        return Result.success(response);
    }

    /**
     * 删除文件
     *
     * @param filename 文件名
     * @return 删除结果
     */
    @DeleteMapping("/file")
    public Result<Void> deleteFile(
            @RequestParam("filename") @NotNull String filename) {
        log.info("开始删除文件: {}", filename);

        boolean deleted = fileUploadService.deleteFile(filename);

        if (deleted) {
            log.info("文件删除成功: {}", filename);
            return Result.success();
        } else {
            log.warn("文件删除失败或文件不存在: {}", filename);
            return Result.failed("文件删除失败或文件不存在");
        }
    }

}
