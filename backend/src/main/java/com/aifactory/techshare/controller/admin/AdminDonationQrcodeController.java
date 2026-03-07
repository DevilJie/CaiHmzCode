package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.DonationQrcodeRequest;
import com.aifactory.techshare.dto.DonationQrcodeResponse;
import com.aifactory.techshare.service.DonationQrcodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 收款码管理控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/admin/donation-qrcodes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "收款码管理（管理端）", description = "打赏收款码的增删改查、展示状态切换等管理接口，需要 ADMIN 或 SUPER_ADMIN 角色")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminDonationQrcodeController {

    private final DonationQrcodeService donationQrcodeService;

    /**
     * 获取所有收款码列表
     *
     * @return 收款码列表
     */
    @GetMapping
    @Operation(summary = "获取收款码列表", description = "获取所有打赏收款码列表")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<List<DonationQrcodeResponse>> getQrcodeList() {
        log.info("管理端获取收款码列表");
        List<DonationQrcodeResponse> qrcodes = donationQrcodeService.getAllQrcodeList();
        return Result.success(qrcodes);
    }

    /**
     * 获取收款码详情
     *
     * @param id 收款码ID
     * @return 收款码详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取收款码详情", description = "根据ID获取收款码详细信息")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "404", description = "收款码不存在")
    public Result<DonationQrcodeResponse> getQrcodeDetail(
            @Parameter(description = "收款码ID", required = true, example = "1")
            @PathVariable @NotNull(message = "收款码ID不能为空") Long id) {
        log.info("管理端获取收款码详情: id={}", id);
        DonationQrcodeResponse qrcode = donationQrcodeService.getQrcodeDetail(id);
        return Result.success(qrcode);
    }

    /**
     * 创建收款码
     *
     * @param request 创建请求
     * @return 收款码详情
     */
    @PostMapping
    @Operation(summary = "创建收款码", description = "创建新的打赏收款码（如微信、支付宝等）")
    @ApiResponse(responseCode = "200", description = "创建成功")
    @ApiResponse(responseCode = "400", description = "参数验证失败")
    public Result<DonationQrcodeResponse> createQrcode(
            @RequestBody(description = "收款码信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody DonationQrcodeRequest request) {
        log.info("创建收款码: type={}, name={}", request.getType(), request.getName());
        DonationQrcodeResponse qrcode = donationQrcodeService.createQrcode(request);
        return Result.success("创建成功", qrcode);
    }

    /**
     * 更新收款码
     *
     * @param id      收款码ID
     * @param request 更新请求
     * @return 收款码详情
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新收款码", description = "更新收款码的名称、图片、类型等信息")
    @ApiResponse(responseCode = "200", description = "更新成功")
    @ApiResponse(responseCode = "404", description = "收款码不存在")
    public Result<DonationQrcodeResponse> updateQrcode(
            @Parameter(description = "收款码ID", required = true, example = "1")
            @PathVariable @NotNull(message = "收款码ID不能为空") Long id,
            @RequestBody(description = "收款码信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody DonationQrcodeRequest request) {
        log.info("更新收款码: id={}", id);
        DonationQrcodeResponse qrcode = donationQrcodeService.updateQrcode(id, request);
        return Result.success("更新成功", qrcode);
    }

    /**
     * 删除收款码
     *
     * @param id 收款码ID
     * @return 成功响应
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除收款码", description = "删除指定收款码")
    @ApiResponse(responseCode = "200", description = "删除成功")
    @ApiResponse(responseCode = "404", description = "收款码不存在")
    public Result<Void> deleteQrcode(
            @Parameter(description = "收款码ID", required = true, example = "1")
            @PathVariable @NotNull(message = "收款码ID不能为空") Long id) {
        log.info("删除收款码: id={}", id);
        donationQrcodeService.deleteQrcode(id);
        return Result.success("删除成功", null);
    }

    /**
     * 切换展示状态
     *
     * @param id 收款码ID
     * @return 收款码详情
     */
    @PutMapping("/{id}/toggle-show")
    @Operation(summary = "切换展示状态", description = "切换收款码在用户端的展示状态")
    @ApiResponse(responseCode = "200", description = "操作成功")
    @ApiResponse(responseCode = "404", description = "收款码不存在")
    public Result<DonationQrcodeResponse> toggleShow(
            @Parameter(description = "收款码ID", required = true, example = "1")
            @PathVariable @NotNull(message = "收款码ID不能为空") Long id) {
        log.info("切换收款码展示状态: id={}", id);
        DonationQrcodeResponse qrcode = donationQrcodeService.toggleShow(id);
        return Result.success(qrcode);
    }

}
