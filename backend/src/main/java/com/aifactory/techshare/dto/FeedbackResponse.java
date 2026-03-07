package com.aifactory.techshare.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 反馈响应DTO
 *
 * @author AI Factory
 */
@Data
@Builder
public class FeedbackResponse {

    /**
     * 反馈ID
     */
    private Long id;

    /**
     * 姓名
     */
    private String name;

    /**
     * 邮箱
     */
    private String email;

    /**
     * QQ号
     */
    private String qq;

    /**
     * 微信号
     */
    private String wechat;

    /**
     * 反馈内容
     */
    private String content;

    /**
     * 是否已读（0: 未读, 1: 已读）
     */
    private Integer isRead;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

}
