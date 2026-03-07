package com.aifactory.techshare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 广告创建/更新请求DTO
 *
 * @author AI Factory
 */
@Data
public class AdvertisementRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 广告位类型（BANNER-轮播 / POPUP-弹窗）
     */
    @NotBlank(message = "广告位类型不能为空")
    private String position;

    /**
     * 广告名称
     */
    @NotBlank(message = "广告名称不能为空")
    private String name;

    /**
     * 广告图片URL
     */
    @NotBlank(message = "广告图片不能为空")
    private String imageUrl;

    /**
     * 跳转链接
     */
    private String linkUrl;

    /**
     * 展示权重（越大越容易展示）
     */
    @NotNull(message = "展示权重不能为空")
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

}
