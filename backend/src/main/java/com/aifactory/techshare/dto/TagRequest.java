package com.aifactory.techshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

/**
 * 标签请求DTO
 *
 * @author AI Factory
 */
@Data
public class TagRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 标签名称
     */
    @NotBlank(message = "标签名称不能为空")
    private String name;

}
