package com.aifactory.techshare.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 收款码实体类
 *
 * @author AI Factory
 */
@Data
@TableName("t_donation_qrcode")
public class DonationQrcode implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 收款码ID
     */
    @TableId(value = "id", type = IdType.AUTO)
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
