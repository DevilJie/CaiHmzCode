package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.SiteInfoResponse;
import com.aifactory.techshare.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 系统信息控制器（用户端）
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/system")
@RequiredArgsConstructor
public class SystemController {

    private final SystemConfigService systemConfigService;

    /**
     * 获取网站信息
     * 用户端接口，无需登录
     *
     * @return 网站信息
     */
    @GetMapping("/info")
    public Result<SiteInfoResponse> getSiteInfo() {
        SiteInfoResponse response = systemConfigService.getSiteInfo();
        return Result.success(response);
    }

}
