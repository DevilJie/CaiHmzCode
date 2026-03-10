package com.aifactory.techshare.service;

import com.aifactory.techshare.dto.SiteInfoResponse;
import com.aifactory.techshare.dto.SystemConfigRequest;
import com.aifactory.techshare.dto.SystemConfigResponse;
import com.aifactory.techshare.entity.SystemConfig;
import com.aifactory.techshare.mapper.SystemConfigMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 系统配置服务
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SystemConfigService {

    private final SystemConfigMapper systemConfigMapper;

    /**
     * 配置键常量 - 基础配置
     */
    private static final String KEY_SITE_NAME = "SITE_NAME";
    private static final String KEY_ICP_NUMBER = "ICP_NUMBER";
    private static final String KEY_FOOTER_TEXT = "FOOTER_TEXT";
    private static final String KEY_GITHUB_TOKEN = "GITHUB_TOKEN";

    /**
     * 配置键常量 - Logo配置
     */
    private static final String KEY_LOGO_TYPE = "LOGO_TYPE";
    private static final String KEY_LOGO_IMAGE_URL = "LOGO_IMAGE_URL";

    /**
     * 配置键常量 - 功能开关
     */
    private static final String KEY_DONATION_ENABLED = "DONATION_ENABLED";

    /**
     * 配置键常量 - 导航配置
     */
    private static final String KEY_NAV_HOME_ENABLED = "NAV_HOME_ENABLED";
    private static final String KEY_NAV_PROJECTS_ENABLED = "NAV_PROJECTS_ENABLED";
    private static final String KEY_NAV_BLOGS_ENABLED = "NAV_BLOGS_ENABLED";
    private static final String KEY_NAV_FEEDBACK_ENABLED = "NAV_FEEDBACK_ENABLED";
    private static final String KEY_NAV_DONATION_ENABLED = "NAV_DONATION_ENABLED";

    /**
     * 获取网站信息（用户端）
     *
     * @return 网站信息
     */
    public SiteInfoResponse getSiteInfo() {
        // 构建导航配置
        SiteInfoResponse.NavConfig navConfig = SiteInfoResponse.NavConfig.builder()
                .home(getBooleanConfigValue(KEY_NAV_HOME_ENABLED, true))
                .projects(getBooleanConfigValue(KEY_NAV_PROJECTS_ENABLED, true))
                .blogs(getBooleanConfigValue(KEY_NAV_BLOGS_ENABLED, true))
                .feedback(getBooleanConfigValue(KEY_NAV_FEEDBACK_ENABLED, true))
                .donation(getBooleanConfigValue(KEY_NAV_DONATION_ENABLED, true))
                .build();

        return SiteInfoResponse.builder()
                .siteName(getConfigValue(KEY_SITE_NAME))
                .icpNumber(getConfigValue(KEY_ICP_NUMBER))
                .footerText(getConfigValue(KEY_FOOTER_TEXT))
                .logoType(getConfigValue(KEY_LOGO_TYPE, "text"))
                .logoImageUrl(getConfigValue(KEY_LOGO_IMAGE_URL))
                .navConfig(navConfig)
                .build();
    }

    /**
     * 获取系统配置（管理端）
     *
     * @return 系统配置
     */
    public SystemConfigResponse getSystemConfigs() {
        // 获取所有配置
        List<SystemConfig> configs = systemConfigMapper.selectList(
                new LambdaQueryWrapper<SystemConfig>()
                        .orderByAsc(SystemConfig::getId)
        );

        // 转换为响应DTO
        List<SystemConfigResponse.ConfigItem> configItems = configs.stream()
                .map(config -> SystemConfigResponse.ConfigItem.builder()
                        .configKey(config.getConfigKey())
                        .configValue(config.getConfigValue())
                        .configName(config.getConfigName())
                        .description(config.getDescription())
                        .build())
                .collect(Collectors.toList());

        return SystemConfigResponse.builder()
                .siteName(getConfigValue(KEY_SITE_NAME))
                .icpNumber(getConfigValue(KEY_ICP_NUMBER))
                .footerText(getConfigValue(KEY_FOOTER_TEXT))
                .githubToken(getConfigValue(KEY_GITHUB_TOKEN))
                .logoType(getConfigValue(KEY_LOGO_TYPE, "text"))
                .logoImageUrl(getConfigValue(KEY_LOGO_IMAGE_URL))
                .navHomeEnabled(getBooleanConfigValue(KEY_NAV_HOME_ENABLED, true))
                .navProjectsEnabled(getBooleanConfigValue(KEY_NAV_PROJECTS_ENABLED, true))
                .navBlogsEnabled(getBooleanConfigValue(KEY_NAV_BLOGS_ENABLED, true))
                .navFeedbackEnabled(getBooleanConfigValue(KEY_NAV_FEEDBACK_ENABLED, true))
                .navDonationEnabled(getBooleanConfigValue(KEY_NAV_DONATION_ENABLED, true))
                .configs(configItems)
                .build();
    }

    /**
     * 更新系统配置
     *
     * @param request 更新请求
     * @return 更新后的配置
     */
    @Transactional(rollbackFor = Exception.class)
    public SystemConfigResponse updateSystemConfigs(SystemConfigRequest request) {
        // 更新基础配置
        updateConfigValue(KEY_SITE_NAME, request.getSiteName());
        updateConfigValue(KEY_ICP_NUMBER, request.getIcpNumber());
        updateConfigValue(KEY_FOOTER_TEXT, request.getFooterText());
        updateConfigValue(KEY_GITHUB_TOKEN, request.getGithubToken());

        // 更新Logo配置
        updateConfigValue(KEY_LOGO_TYPE, request.getLogoType());
        updateConfigValue(KEY_LOGO_IMAGE_URL, request.getLogoImageUrl());

        // 更新导航配置
        updateBooleanConfigValue(KEY_NAV_HOME_ENABLED, request.getNavHomeEnabled());
        updateBooleanConfigValue(KEY_NAV_PROJECTS_ENABLED, request.getNavProjectsEnabled());
        updateBooleanConfigValue(KEY_NAV_BLOGS_ENABLED, request.getNavBlogsEnabled());
        updateBooleanConfigValue(KEY_NAV_FEEDBACK_ENABLED, request.getNavFeedbackEnabled());
        updateBooleanConfigValue(KEY_NAV_DONATION_ENABLED, request.getNavDonationEnabled());

    /**
     * 配置键转换为描述
     private String keyToDescription(String key) {
        return switch (key) {
            case " "SITE_NAME":
                case " "网站显示名称";
            case "KEY_LOGO_TYPE":
                case " "Logo类型":
                case " "文字Logo":
                case " "图片Logo":
                case "KEY_LOGO_IMAGE_URL:
                case " "Logo图片URL":
                case "KEY_NAV_HOME_ENABLED":
                case " "首页导航是否启用";
            case "KEY_NAV_PROJECTS_ENABLED":
                case " "项目导航是否启用";
            case "KEY_NAV_BLOGS_ENABLED":
                case " "博客导航是否启用";
            case "KEY_NAV_FEEDBACK_ENABLED":
                case " "反馈导航是否启用";
            case "KEY_NAV_DONATION_ENABLED":
                case " "打赏导航是否启用";
            case "KEY_DONATION_ENABLED":
                case " "捐赠功能是否启用":
            default:
                return null;
        }
    }

    /**
     * 获取单个配置值
     *
     * @param key 配置键
     * @return 配置值，不存在返回空字符串
     */
    public String getConfigValue(String key) {
        return getConfigValue(key, "");
    }

    /**
     * 获取单个配置值（带默认值）
     *
     * @param key          配置键
     * @param defaultValue 默认值
     * @return 配置值，不存在返回默认值
     */
    public String getConfigValue(String key, String defaultValue) {
        SystemConfig config = systemConfigMapper.selectOne(
                new LambdaQueryWrapper<SystemConfig>()
                        .eq(SystemConfig::getConfigKey, key)
        );
        if (config == null || config.getConfigValue() == null || config.getConfigValue().isBlank()) {
            return defaultValue;
        }
        return config.getConfigValue();
    }

    /**
     * 获取布尔类型配置值
     *
     * @param key          配置键
     * @param defaultValue 默认值
     * @return 布尔配置值
     */
    public Boolean getBooleanConfigValue(String key, Boolean defaultValue) {
        String value = getConfigValue(key);
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return Boolean.parseBoolean(value);
    }

    /**
     * 更新单个配置值（如果不存在则插入）
     *
     * @param key   配置键
     * @param value 配置值
     */
    private void updateConfigValue(String key, String value) {
        if (value == null) {
            value = "";
        }
        // 先查询是否存在
        SystemConfig existingConfig = systemConfigMapper.selectOne(
                new LambdaQueryWrapper<SystemConfig>()
                        .eq(SystemConfig::getConfigKey, key)
        );

        if (existingConfig != null) {
            // 存在则更新
            systemConfigMapper.update(null, new LambdaUpdateWrapper<SystemConfig>()
                    .eq(SystemConfig::getConfigKey, key)
                    .set(SystemConfig::getConfigValue, value)
            );
        } else {
            // 不存在则插入
            SystemConfig newConfig = new SystemConfig();
            newConfig.setConfigKey(key);
            newConfig.setConfigValue(value);
            newConfig.setConfigName(keyToName(key));
            newConfig.setDescription(keyToDescription(key));
            systemConfigMapper.insert(newConfig);
        }
    }

    /**
     * 配置键转换为配置名称
     */
    private String keyToName(String key) {
        return switch (key) {
            case "SITE_NAME" -> "网站名称";
            case "ICP_NUMBER" -> "ICP备案号";
            case "FOOTER_TEXT" -> "页脚文字";
            case "GITHUB_TOKEN" -> "GitHub Token";
            case "LOGO_TYPE" -> "Logo类型";
            case "LOGO_IMAGE_URL" -> "Logo图片URL";
            case "NAV_HOME_ENABLED" -> "首页导航开关";
            case "NAV_PROJECTS_ENABLED" -> "项目导航开关";
            case "NAV_BLOGS_ENABLED" -> "博客导航开关";
            case "NAV_FEEDBACK_ENABLED" -> "反馈导航开关";
            case "NAV_DONATION_ENABLED" -> "打赏导航开关";
            default -> key;
        };
    }

    /**
     * 配置键转换为描述
     */
    private String keyToDescription(String key) {
        return switch (key) {
            case "SITE_NAME" -> "网站显示名称";
            case "ICP_NUMBER" -> "ICP备案号，显示在页脚";
            case "FOOTER_TEXT" -> "页脚显示的文字";
            case "GITHUB_TOKEN" -> "用于获取GitHub README的Token";
            case "LOGO_TYPE" -> "Logo类型：text或image";
            case "LOGO_IMAGE_URL" -> "Logo图片的URL地址";
            case "NAV_HOME_ENABLED" -> "是否在导航栏显示首页链接";
            case "NAV_PROJECTS_ENABLED" -> "是否在导航栏显示项目链接";
            case "NAV_BLOGS_ENABLED" -> "是否在导航栏显示博客链接";
            case "NAV_FEEDBACK_ENABLED" -> "是否在导航栏显示反馈链接";
            case "NAV_DONATION_ENABLED" -> "是否在导航栏显示打赏链接";
            default -> key;
        };
    }

    /**
     * 更新布尔类型配置值
     *
     * @param key   配置键
     * @param value 布尔值
     */
    private void updateBooleanConfigValue(String key, Boolean value) {
        String strValue = (value != null) ? String.valueOf(value) : "false";
        updateConfigValue(key, strValue);
    }

}
