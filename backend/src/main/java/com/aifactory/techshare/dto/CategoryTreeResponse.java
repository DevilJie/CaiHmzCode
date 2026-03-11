package com.aifactory.techshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 分类树响应DTO
 * 用于展示多级分类的树形结构
 *
 * @author AI Factory
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryTreeResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 分类ID
     */
    private Long id;

    /**
     * 分类名称
     */
    private String name;

    /**
     * 父分类ID，顶级为NULL
     */
    private Long parentId;

    /**
     * 层级深度，顶级为0
     */
    private Integer level;

    /**
     * 排序顺序
     */
    private Integer sortOrder;

    /**
     * 该分类下的博客数量
     */
    private Integer blogCount;

    /**
     * 是否为末级分类（没有子分类）
     */
    private Boolean isLeaf;

    /**
     * 子分类列表
     */
    @Builder.Default
    private List<CategoryTreeResponse> children = new ArrayList<>();

}
