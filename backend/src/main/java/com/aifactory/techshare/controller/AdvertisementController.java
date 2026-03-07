package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.AdvertisementResponse;
import com.aifactory.techshare.service.AdvertisementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    /**
     * 获取广告列表
     *
     * @param position 广告位类型（BANNER/POPUP）
     * @return 广告列表
     */
    @GetMapping("/advertisements")
    public Result<List<AdvertisementResponse>> getAdvertisements(
            @RequestParam(required = false) String position) {
        log.info("获取广告列表: position={}", position);
        List<AdvertisementResponse> advertisements = advertisementService.getActiveAdvertisements(position);
        return Result.success(advertisements);
    }

}
