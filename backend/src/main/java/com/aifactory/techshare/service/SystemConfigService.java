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
     * 配置键常量
     */
    private static final String KEY_SITE_NAME = "SITE_NAME";
    private static final String KEY_ICP_NUMBER = "ICP_NUMBER";
    private static final String KEY_FOOTER_TEXT = "FOOTER_TEXT";
    private static final String KEY_GITHUB_TOKEN = "GITHUB_TOKEN";

    /**
     * 获取网站信息（用户端）
     *
     * @return 网站信息
     */
    public SiteInfoResponse getSiteInfo() {
        return SiteInfoResponse.builder()
                .siteName(getConfigValue(KEY_SITE_NAME))
                .icpNumber(getConfigValue(KEY_ICP_NUMBER))
                .footerText(getConfigValue(KEY_FOOTER_TEXT))
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
        // 更新各项配置
        updateConfigValue(KEY_SITE_NAME, request.getSiteName());
        updateConfigValue(KEY_ICP_NUMBER, request.getIcpNumber());
        updateConfigValue(KEY_FOOTER_TEXT, request.getFooterText());
        updateConfigValue(KEY_GITHUB_TOKEN, request.getGithubToken());

        log.info("系统配置更新成功");

        return getSystemConfigs();
    }

    /**
     * 获取单个配置值
     *
     * @param key 配置键
     * @return 配置值，不存在返回空字符串
     */
    public String getConfigValue(String key) {
        SystemConfig config = systemConfigMapper.selectOne(
                new LambdaQueryWrapper<SystemConfig>()
                        .eq(SystemConfig::getConfigKey, key)
        );
        return config != null ? config.getConfigValue() : "";
    }

    /**
     * 更新单个配置值
     *
     * @param key   配置键
     * @param value 配置值
     */
    private void updateConfigValue(String key, String value) {
        if (value == null) {
            value = "";
        }
        systemConfigMapper.update(null, new LambdaUpdateWrapper<SystemConfig>()
                .eq(SystemConfig::getConfigKey, key)
                .set(SystemConfig::getConfigValue, value)
        );
    }

}
