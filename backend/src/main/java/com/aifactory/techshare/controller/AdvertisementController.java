package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.AdvertisementResponse;
import com.aifactory.techshare.service.AdvertisementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 广告控制器（用户端）
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "广告管理（用户端）", description = "获取展示中的广告内容，无需登录")
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    /**
     * 获取广告列表
     *
     * @param position 广告位类型（BANNER/POPUP）
     * @return 广告列表
     */
    @GetMapping("/advertisements")
    @Operation(summary = "获取广告列表", description = "获取当前有效状态的广告列表，可按广告位类型筛选")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<List<AdvertisementResponse>> getAdvertisements(
            @Parameter(description = "广告位类型：BANNER-横幅广告，POPUP-弹窗广告", example = "BANNER")
            @RequestParam(required = false) @Pattern(regexp = "^(BANNER|POPUP)?$", message = "广告位类型只能是BANNER或POPUP") String position) {
        log.info("获取广告列表: position={}", position);
        List<AdvertisementResponse> advertisements = advertisementService.getActiveAdvertisements(position);
        return Result.success(advertisements);
    }

}
