package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.AdvertisementRequest;
import com.aifactory.techshare.dto.AdvertisementResponse;
import com.aifactory.techshare.service.AdvertisementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 广告管理控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/admin/advertisements")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "广告管理（管理端）", description = "广告的增删改查、启用/禁用等管理接口，需要 ADMIN 或 SUPER_ADMIN 角色")
@SecurityRequirement(name = "Bearer Authentication")
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
    @Operation(summary = "获取广告列表", description = "分页查询所有广告，支持按位置、状态、关键词筛选")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<PageResult<AdvertisementResponse>> getAdvertisementList(
            @Parameter(description = "页码，从1开始", example = "1")
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为1") int pageNum,
            @Parameter(description = "每页数量，最大100", example = "10")
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "每页数量最小为1") @Max(value = 100, message = "每页数量最大为100") int pageSize,
            @Parameter(description = "广告位类型：BANNER-横幅广告，POPUP-弹窗广告", example = "BANNER")
            @RequestParam(required = false) @Pattern(regexp = "^(BANNER|POPUP)?$", message = "广告位类型只能是BANNER或POPUP") String position,
            @Parameter(description = "状态：0-禁用，1-启用", example = "1")
            @RequestParam(required = false) Integer status,
            @Parameter(description = "搜索关键词", example = "广告")
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
    @Operation(summary = "获取广告详情", description = "根据ID获取广告详细信息")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "404", description = "广告不存在")
    public Result<AdvertisementResponse> getAdvertisementDetail(
            @Parameter(description = "广告ID", required = true, example = "1")
            @PathVariable @NotNull(message = "广告ID不能为空") Long id) {
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
    @Operation(summary = "创建广告", description = "创建新广告")
    @ApiResponse(responseCode = "200", description = "创建成功")
    @ApiResponse(responseCode = "400", description = "参数验证失败")
    public Result<AdvertisementResponse> createAdvertisement(
            @RequestBody(description = "广告信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody AdvertisementRequest request) {
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
    @Operation(summary = "更新广告", description = "更新广告的标题、图片、链接等信息")
    @ApiResponse(responseCode = "200", description = "更新成功")
    @ApiResponse(responseCode = "404", description = "广告不存在")
    public Result<AdvertisementResponse> updateAdvertisement(
            @Parameter(description = "广告ID", required = true, example = "1")
            @PathVariable @NotNull(message = "广告ID不能为空") Long id,
            @RequestBody(description = "广告信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody AdvertisementRequest request) {
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
    @Operation(summary = "启用广告", description = "启用指定广告，启用后用户端可见")
    @ApiResponse(responseCode = "200", description = "启用成功")
    @ApiResponse(responseCode = "404", description = "广告不存在")
    public Result<AdvertisementResponse> enableAdvertisement(
            @Parameter(description = "广告ID", required = true, example = "1")
            @PathVariable @NotNull(message = "广告ID不能为空") Long id) {
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
    @Operation(summary = "禁用广告", description = "禁用指定广告，禁用后用户端不可见")
    @ApiResponse(responseCode = "200", description = "禁用成功")
    @ApiResponse(responseCode = "404", description = "广告不存在")
    public Result<AdvertisementResponse> disableAdvertisement(
            @Parameter(description = "广告ID", required = true, example = "1")
            @PathVariable @NotNull(message = "广告ID不能为空") Long id) {
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
    @Operation(summary = "删除广告", description = "删除指定广告")
    @ApiResponse(responseCode = "200", description = "删除成功")
    @ApiResponse(responseCode = "404", description = "广告不存在")
    public Result<Void> deleteAdvertisement(
            @Parameter(description = "广告ID", required = true, example = "1")
            @PathVariable @NotNull(message = "广告ID不能为空") Long id) {
        log.info("删除广告: id={}", id);
        advertisementService.deleteAdvertisement(id);
        return Result.success("删除成功", null);
    }

}
