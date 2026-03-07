package com.aifactory.techshare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;

/**
 * 更新用户请求DTO
 *
 * @author AI Factory
 */
@Data
public class UserUpdateRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 昵称
     */
    @Size(max = 50, message = "昵称长度不能超过50个字符")
    private String nickname;

    /**
     * 邮箱
     */
    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱长度不能超过100个字符")
    private String email;

    /**
     * 头像URL
     */
    private String avatar;

    /**
     * 角色（ADMIN, SUPER_ADMIN）
     */
    @Pattern(regexp = "^(ADMIN|SUPER_ADMIN)$", message = "角色必须是ADMIN或SUPER_ADMIN")
    private String role;

    /**
     * 状态（1: 启用, 0: 禁用）
     */
    private Integer status;

    /**
     * 新密码（可选，如果提供则更新密码）
     */
    @Size(min = 6, max = 100, message = "密码长度必须在6-100个字符之间")
    private String password;

}
