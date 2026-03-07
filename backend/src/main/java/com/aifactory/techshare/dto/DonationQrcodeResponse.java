package com.aifactory.techshare.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 收款码响应DTO
 *
 * @author AI Factory
 */
@Data
@Builder
public class DonationQrcodeResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 收款码ID
     */
    private Long id;

    /**
     * 类型（WECHAT: 微信, ALIPAY: 支付宝）
     */
    private String type;

    /**
     * 名称
     */
    private String name;

    /**
     * 二维码图片URL
     */
    private String qrcodeUrl;

    /**
     * 是否展示（0: 不展示, 1: 展示）
     */
    private Integer isShow;

    /**
     * 排序顺序
     */
    private Integer sortOrder;

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
