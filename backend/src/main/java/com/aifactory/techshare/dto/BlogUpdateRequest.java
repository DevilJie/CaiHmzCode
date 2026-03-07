package com.aifactory.techshare.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 更新博客请求DTO
 *
 * @author AI Factory
 */
@Data
public class BlogUpdateRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 标题
     */
    private String title;

    /**
     * 摘要
     */
    private String summary;

    /**
     * 内容
     */
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
