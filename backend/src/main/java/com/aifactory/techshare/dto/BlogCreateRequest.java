package com.aifactory.techshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 创建博客请求DTO
 *
 * @author AI Factory
 */
@Data
public class BlogCreateRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 标题
     */
    @NotBlank(message = "标题不能为空")
    private String title;

    /**
     * 摘要
     */
    private String summary;

    /**
     * 内容
     */
    @NotBlank(message = "内容不能为空")
    private String content;

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 封面图片
     */
    private String coverImage;

    /**
     * 视频URL
     */
    private String videoUrl;

    /**
     * 标签ID列表
     */
    private List<Long> tagIds;

}
