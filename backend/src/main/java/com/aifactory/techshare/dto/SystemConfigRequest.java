package com.aifactory.techshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

/**
 * 系统配置更新请求DTO
 *
 * @author AI Factory
 */
@Data
public class SystemConfigRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 网站名称
     */
    @NotBlank(message = "网站名称不能为空")
    private String siteName;

    /**
     * ICP备案号
     */
    private String icpNumber;

    /**
     * 页脚文字
     */
    private String footerText;

    /**
     * GitHub Token
     */
    private String githubToken;

    /**
     * Logo类型 (text/image)
     */
    private String logoType;

    /**
     * Logo图片URL
     */
    private String logoImageUrl;

    /**
     * 是否启用捐赠功能
     */
    private Boolean donationEnabled;

    /**
     * 是否显示首页导航
     */
    private Boolean navHomeEnabled;

    /**
     * 是否显示项目导航
     */
    private Boolean navProjectsEnabled;

    /**
     * 是否显示博客导航
     */
    private Boolean navBlogsEnabled;

    /**
     * 是否显示反馈导航
     */
    private Boolean navFeedbackEnabled;

    /**
     * 是否显示捐赠导航
     */
    private Boolean navDonationEnabled;

}
