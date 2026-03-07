package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.SystemConfigRequest;
import com.aifactory.techshare.dto.SystemConfigResponse;
import com.aifactory.techshare.service.SystemConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 系统配置控制器（管理端）
 * 需要SUPER_ADMIN角色
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/admin/system")
@RequiredArgsConstructor
@Tag(name = "系统配置管理（管理端）", description = "系统全局配置的管理接口，需要 SUPER_ADMIN 角色")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminSystemController {

    private final SystemConfigService systemConfigService;

    /**
     * 获取系统配置
     * 需要SUPER_ADMIN角色
     *
     * @return 系统配置
     */
    @GetMapping("/configs")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "获取系统配置", description = "获取所有系统配置项")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "403", description = "权限不足")
    public Result<SystemConfigResponse> getSystemConfigs() {
        log.info("获取系统配置");
        SystemConfigResponse response = systemConfigService.getSystemConfigs();
        return Result.success(response);
    }

    /**
     * 更新系统配置
     * 需要SUPER_ADMIN角色
     *
     * @param request 更新请求
     * @return 更新后的配置
     */
    @PutMapping("/configs")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "更新系统配置", description = "更新系统全局配置项，如网站名称、Logo、描述等")
    @ApiResponse(responseCode = "200", description = "更新成功")
    @ApiResponse(responseCode = "400", description = "参数验证失败")
    @ApiResponse(responseCode = "403", description = "权限不足")
    public Result<SystemConfigResponse> updateSystemConfigs(
            @RequestBody(description = "系统配置", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody SystemConfigRequest request) {
        log.info("更新系统配置");
        SystemConfigResponse response = systemConfigService.updateSystemConfigs(request);
        return Result.success("配置更新成功", response);
    }

}
