package com.aifactory.techshare.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 管理端项目列表查询参数
 *
 * @author AI Factory
 */
@Data
public class AdminProjectListRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 当前页码
     */
    private Integer pageNum = 1;

    /**
     * 每页数量
     */
    private Integer pageSize = 10;

    /**
     * 搜索关键词（项目名称）
     */
    private String keyword;

    /**
     * 是否显示（可选，不传则查询全部）
     */
    private Integer isShow;

}
