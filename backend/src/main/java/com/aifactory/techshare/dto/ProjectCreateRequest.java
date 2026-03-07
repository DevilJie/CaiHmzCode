package com.aifactory.techshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 新增项目请求DTO
 *
 * @author AI Factory
 */
@Data
public class ProjectCreateRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 项目名称
     */
    @NotBlank(message = "项目名称不能为空")
    private String name;

    /**
     * 项目简介
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
     * 排序权重（越大越靠前）
     */
    private Integer sortOrder = 0;

    /**
     * 是否显示（1显示 0隐藏）
     */
    private Integer isShow = 1;

}
