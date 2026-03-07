package com.aifactory.techshare.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 项目详情响应DTO（含README）
 *
 * @author AI Factory
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectDetailResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 项目ID
     */
    private Long id;

    /**
     * 项目名称
     */
    private String name;

    /**
     * 项目描述
     */
    private String description;

    /**
     * 项目在线地址
     */
    private String projectUrl;

    /**
     * GitHub仓库地址
     */
    private String githubUrl;

    /**
     * 封面图URL
     */
    private String coverImage;

    /**
     * 技术标签列表
     */
    private List<String> techTags;

    /**
     * 浏览次数
     */
    private Integer viewCount;

    /**
     * README内容（Markdown格式）
     */
    private String readmeContent;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

}
