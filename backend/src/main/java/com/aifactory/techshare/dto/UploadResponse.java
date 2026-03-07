package com.aifactory.techshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文件上传响应DTO
 *
 * @author AI Factory
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse {

    /**
     * 文件访问URL
     */
    private String url;

    /**
     * 原始文件名
     */
    private String filename;

    /**
     * 文件大小（字节）
     */
    private Long size;

}
