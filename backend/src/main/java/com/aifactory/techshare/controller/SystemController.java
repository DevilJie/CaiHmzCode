package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.SiteInfoResponse;
import com.aifactory.techshare.service.SystemConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "系统信息（用户端）", description = "获取网站基本信息，无需登录")
public class SystemController {

    private final SystemConfigService systemConfigService;

    /**
     * 获取网站信息
     * 用户端接口，无需登录
     *
     * @return 网站信息
     */
    @GetMapping("/info")
    @Operation(summary = "获取网站信息", description = "获取网站名称、描述、Logo、联系方式等基本信息")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<SiteInfoResponse> getSiteInfo() {
        log.info("获取网站信息");
        SiteInfoResponse response = systemConfigService.getSiteInfo();
        return Result.success(response);
    }

}
