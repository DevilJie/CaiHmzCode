package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.DonationQrcodeRequest;
import com.aifactory.techshare.dto.DonationQrcodeResponse;
import com.aifactory.techshare.service.DonationQrcodeService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 收款码管理控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/donation-qrcodes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminDonationQrcodeController {

    private final DonationQrcodeService donationQrcodeService;

    /**
     * 获取所有收款码列表
     *
     * @return 收款码列表
     */
    @GetMapping
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
    public Result<DonationQrcodeResponse> getQrcodeDetail(@PathVariable Long id) {
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
    public Result<DonationQrcodeResponse> createQrcode(@Valid @RequestBody DonationQrcodeRequest request) {
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
    public Result<DonationQrcodeResponse> updateQrcode(@PathVariable Long id,
                                                        @Valid @RequestBody DonationQrcodeRequest request) {
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
    public Result<Void> deleteQrcode(@PathVariable Long id) {
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
    public Result<DonationQrcodeResponse> toggleShow(@PathVariable Long id) {
        log.info("切换收款码展示状态: id={}", id);
        DonationQrcodeResponse qrcode = donationQrcodeService.toggleShow(id);
        return Result.success(qrcode);
    }

}
