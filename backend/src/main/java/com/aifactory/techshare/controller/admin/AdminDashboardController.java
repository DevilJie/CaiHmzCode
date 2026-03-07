package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.DashboardStatsResponse;
import com.aifactory.techshare.service.DashboardService;
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
public class AdminDashboardController {

    private final DashboardService dashboardService;

    /**
     * 获取仪表盘统计数据
     *
     * @return 统计数据
     */
    @GetMapping("/stats")
    public Result<DashboardStatsResponse> getStats() {
        DashboardStatsResponse response = dashboardService.getStats();
        return Result.success(response);
    }

}
