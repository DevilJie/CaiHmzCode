package com.aifactory.techshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * 系统配置响应DTO
 *
 * @author AI Factory
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfigResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 网站名称
     */
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
     * Logo类型
     */
    private String logoType;

    /**
     * Logo图片URL
     */
    private String logoImageUrl;

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

    /**
     * 所有配置项列表
     */
    private List<ConfigItem> configs;

    /**
     * 配置项
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConfigItem implements Serializable {

        private static final long serialVersionUID = 1L;

        /**
         * 配置键
         */
        private String configKey;

        /**
         * 配置值
         */
        private String configValue;

        /**
         * 配置名称
         */
        private String configName;

        /**
         * 配置描述
         */
        private String description;
    }

}
