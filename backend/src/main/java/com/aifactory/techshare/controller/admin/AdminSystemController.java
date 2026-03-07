package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.SystemConfigRequest;
import com.aifactory.techshare.dto.SystemConfigResponse;
import com.aifactory.techshare.service.SystemConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 系统配置控制器（管理端）
 * 需要SUPER_ADMIN角色
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/system")
@RequiredArgsConstructor
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
    public Result<SystemConfigResponse> getSystemConfigs() {
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
    public Result<SystemConfigResponse> updateSystemConfigs(@Valid @RequestBody SystemConfigRequest request) {
        SystemConfigResponse response = systemConfigService.updateSystemConfigs(request);
        return Result.success("配置更新成功", response);
    }

}
