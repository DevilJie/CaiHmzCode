package com.aifactory.techshare.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 项目实体类
 *
 * @author AI Factory
 */
@Data
@TableName("t_project")
public class Project implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 项目ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 项目名称
     */
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
     * 技术标签（JSON数组字符串）
     */
    private String techTags;

    /**
     * 排序权重（越大越靠前）
     */
    private Integer sortOrder;

    /**
     * 是否显示（1显示 0隐藏）
     */
    private Integer isShow;

    /**
     * 浏览次数
     */
    private Integer viewCount;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 逻辑删除标记（0: 未删除, 1: 已删除）
     */
    @TableLogic
    private Integer deleted;

}
