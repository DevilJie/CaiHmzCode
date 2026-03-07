package com.aifactory.techshare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 收款码请求DTO
 *
 * @author AI Factory
 */
@Data
public class DonationQrcodeRequest {

    /**
     * 类型（WECHAT: 微信, ALIPAY: 支付宝）
     */
    @NotBlank(message = "类型不能为空")
    private String type;

    /**
     * 名称
     */
    @Size(max = 50, message = "名称长度不能超过50个字符")
    private String name;

    /**
     * 二维码图片URL
     */
    @NotBlank(message = "二维码图片不能为空")
    @Size(max = 500, message = "二维码URL长度不能超过500个字符")
    private String qrcodeUrl;

    /**
     * 是否展示（0: 不展示, 1: 展示）
     */
    private Integer isShow;

    /**
     * 排序顺序
     */
    private Integer sortOrder;

}
