package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.UploadResponse;
import com.aifactory.techshare.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
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
@Tag(name = "文件上传（管理端）", description = "图片上传和文件删除接口")
@SecurityRequirement(name = "Bearer Authentication")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    /**
     * 上传图片
     * 支持jpg/png/gif/webp格式，最大5MB
     *
     * @param file 图片文件
     * @return 上传结果
     */
    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "上传图片", description = "上传图片文件，支持 jpg/png/gif/webp 格式，最大 5MB")
    @ApiResponse(responseCode = "200", description = "上传成功")
    @ApiResponse(responseCode = "400", description = "文件格式不支持或文件过大")
    public Result<UploadResponse> uploadImage(
            @Parameter(description = "图片文件", required = true,
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(type = "string", format = "binary")))
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
    @Operation(summary = "删除文件", description = "删除服务器上的指定文件")
    @ApiResponse(responseCode = "200", description = "删除成功")
    @ApiResponse(responseCode = "400", description = "文件删除失败或文件不存在")
    public Result<Void> deleteFile(
            @Parameter(description = "文件名", required = true, example = "image.jpg")
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
