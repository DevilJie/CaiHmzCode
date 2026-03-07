package com.aifactory.techshare.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
    @Min(value = 1, message = "页码最小为1")
    private Integer pageNum = 1;

    /**
     * 每页数量
     */
    @Min(value = 1, message = "每页数量最小为1")
    @Max(value = 100, message = "每页数量最大为100")
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
