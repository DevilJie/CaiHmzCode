package com.aifactory.techshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

/**
 * 分类请求DTO
 *
 * @author AI Factory
 */
@Data
public class CategoryRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 分类名称
     */
    @NotBlank(message = "分类名称不能为空")
    private String name;

    /**
     * 排序顺序
     */
    private Integer sortOrder;

}
