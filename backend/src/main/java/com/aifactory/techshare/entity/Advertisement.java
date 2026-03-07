package com.aifactory.techshare.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 广告实体类
 *
 * @author AI Factory
 */
@Data
@TableName("t_advertisement")
public class Advertisement implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 广告ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 广告位类型（BANNER-轮播 / POPUP-弹窗）
     */
    private String position;

    /**
     * 广告名称
     */
    private String name;

    /**
     * 广告图片URL
     */
    private String imageUrl;

    /**
     * 跳转链接
     */
    private String linkUrl;

    /**
     * 展示权重（越大越容易展示）
     */
    private Integer weight;

    /**
     * 展示开始时间
     */
    private LocalDateTime startTime;

    /**
     * 展示结束时间
     */
    private LocalDateTime endTime;

    /**
     * 状态（0: 禁用, 1: 启用）
     */
    private Integer status;

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
