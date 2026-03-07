package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.AdvertisementRequest;
import com.aifactory.techshare.dto.AdvertisementResponse;
import com.aifactory.techshare.service.AdvertisementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 广告管理控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/advertisements")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminAdvertisementController {

    private final AdvertisementService advertisementService;

    /**
     * 获取广告列表（管理端）
     *
     * @param pageNum  页码（默认1）
     * @param pageSize 每页数量（默认10）
     * @param position 广告位类型（可选）
     * @param status   状态（可选）
     * @param keyword  关键词（可选）
     * @return 广告分页列表
     */
    @GetMapping
    public Result<PageResult<AdvertisementResponse>> getAdvertisementList(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword) {
        log.info("管理端获取广告列表: pageNum={}, pageSize={}, position={}, status={}, keyword={}",
                pageNum, pageSize, position, status, keyword);
        PageResult<AdvertisementResponse> result = advertisementService.getAdvertisementListForAdmin(
                pageNum, pageSize, position, status, keyword);
        return Result.success(result);
    }

    /**
     * 获取广告详情（管理端）
     *
     * @param id 广告ID
     * @return 广告详情
     */
    @GetMapping("/{id}")
    public Result<AdvertisementResponse> getAdvertisementDetail(@PathVariable Long id) {
        log.info("管理端获取广告详情: id={}", id);
        AdvertisementResponse advertisement = advertisementService.getAdvertisementDetail(id);
        return Result.success(advertisement);
    }

    /**
     * 创建广告
     *
     * @param request 创建请求
     * @return 广告详情
     */
    @PostMapping
    public Result<AdvertisementResponse> createAdvertisement(@Valid @RequestBody AdvertisementRequest request) {
        log.info("创建广告: name={}", request.getName());
        AdvertisementResponse advertisement = advertisementService.createAdvertisement(request);
        return Result.success("创建成功", advertisement);
    }

    /**
     * 更新广告
     *
     * @param id      广告ID
     * @param request 更新请求
     * @return 广告详情
     */
    @PutMapping("/{id}")
    public Result<AdvertisementResponse> updateAdvertisement(@PathVariable Long id,
                                                              @Valid @RequestBody AdvertisementRequest request) {
        log.info("更新广告: id={}", id);
        AdvertisementResponse advertisement = advertisementService.updateAdvertisement(id, request);
        return Result.success("更新成功", advertisement);
    }

    /**
     * 启用广告
     *
     * @param id 广告ID
     * @return 广告详情
     */
    @PutMapping("/{id}/enable")
    public Result<AdvertisementResponse> enableAdvertisement(@PathVariable Long id) {
        log.info("启用广告: id={}", id);
        AdvertisementResponse advertisement = advertisementService.enableAdvertisement(id);
        return Result.success("启用成功", advertisement);
    }

    /**
     * 禁用广告
     *
     * @param id 广告ID
     * @return 广告详情
     */
    @PutMapping("/{id}/disable")
    public Result<AdvertisementResponse> disableAdvertisement(@PathVariable Long id) {
        log.info("禁用广告: id={}", id);
        AdvertisementResponse advertisement = advertisementService.disableAdvertisement(id);
        return Result.success("禁用成功", advertisement);
    }

    /**
     * 删除广告
     *
     * @param id 广告ID
     * @return 成功响应
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteAdvertisement(@PathVariable Long id) {
        log.info("删除广告: id={}", id);
        advertisementService.deleteAdvertisement(id);
        return Result.success("删除成功", null);
    }

}
