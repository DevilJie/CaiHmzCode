package com.aifactory.techshare.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 博客实体类
 *
 * @author AI Factory
 */
@Data
@TableName("t_blog")
public class Blog implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 博客ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

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
     * 状态（0: 草稿, 1: 已发布）
     */
    private Integer status;

    /**
     * 发布时间
     */
    private LocalDateTime publishTime;

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
