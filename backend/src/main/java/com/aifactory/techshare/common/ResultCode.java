package com.aifactory.techshare.common;

import lombok.Getter;

/**
 * 统一响应状态码枚举
 *
 * @author AI Factory
 */
@Getter
public enum ResultCode {

    /**
     * 成功
     */
    SUCCESS(200, "操作成功"),

    /**
     * 失败
     */
    FAILED(500, "操作失败"),

    /**
     * 参数错误
     */
    PARAM_ERROR(400, "参数错误"),

    /**
     * 未认证
     */
    UNAUTHORIZED(401, "未认证，请先登录"),

    /**
     * 无权限
     */
    FORBIDDEN(403, "无权限访问"),

    /**
     * 资源不存在
     */
    NOT_FOUND(404, "资源不存在"),

    /**
     * 服务器内部错误
     */
    INTERNAL_ERROR(500, "服务器内部错误"),

    /**
     * 用户名或密码错误
     */
    LOGIN_ERROR(4001, "用户名或密码错误"),

    /**
     * Token无效
     */
    TOKEN_INVALID(4002, "Token无效或已过期"),

    /**
     * 用户已存在
     */
    USER_EXISTS(4003, "用户名已存在"),

    /**
     * 用户被禁用
     */
    USER_DISABLED(4004, "用户已被禁用");

    /**
     * 状态码
     */
    private final int code;

    /**
     * 消息
     */
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

}
