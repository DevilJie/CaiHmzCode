package com.aifactory.techshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 网站信息响应DTO（用户端）
 *
 * @author AI Factory
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteInfoResponse implements Serializable {

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
     * Logo类型：text 或 image
     */
    private String logoType;

    /**
     * Logo图片地址
     */
    private String logoImageUrl;

    /**
     * 导航配置
     */
    private NavConfig navConfig;

    /**
     * 导航配置内部类
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NavConfig implements Serializable {
        private static final long serialVersionUID = 1L;

        /**
         * 首页导航是否显示
         */
        private Boolean home;

        /**
         * 项目导航是否显示
         */
        private Boolean projects;

        /**
         * 博客导航是否显示
         */
        private Boolean blogs;

        /**
         * 反馈导航是否显示
         */
        private Boolean feedback;

        /**
         * 打赏导航是否显示
         */
        private Boolean donation;
    }

}
