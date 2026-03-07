package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.DashboardStatsResponse;
import com.aifactory.techshare.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 仪表盘控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "仪表盘（管理端）", description = "管理后台首页统计数据接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    /**
     * 获取仪表盘统计数据
     *
     * @return 统计数据
     */
    @GetMapping("/stats")
    @Operation(summary = "获取仪表盘统计数据", description = "获取项目数、博客数、访问量、反馈数等统计数据")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<DashboardStatsResponse> getStats() {
        log.info("获取仪表盘统计数据");
        DashboardStatsResponse response = dashboardService.getStats();
        return Result.success(response);
    }

}
