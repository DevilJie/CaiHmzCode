package com.aifactory.techshare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 提交反馈请求DTO
 *
 * @author AI Factory
 */
@Data
public class FeedbackRequest {

    /**
     * 姓名（选填）
     */
    @Size(max = 50, message = "姓名长度不能超过50个字符")
    private String name;

    /**
     * 邮箱（选填）
     */
    @Size(max = 100, message = "邮箱长度不能超过100个字符")
    private String email;

    /**
     * QQ号（选填）
     */
    @Size(max = 20, message = "QQ号长度不能超过20个字符")
    private String qq;

    /**
     * 微信号（选填）
     */
    @Size(max = 50, message = "微信号长度不能超过50个字符")
    private String wechat;

    /**
     * 反馈内容（必填）
     */
    @NotBlank(message = "反馈内容不能为空")
    @Size(max = 2000, message = "反馈内容长度不能超过2000个字符")
    private String content;

}
