package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.DonationQrcodeResponse;
import com.aifactory.techshare.dto.FeedbackRequest;
import com.aifactory.techshare.dto.FeedbackResponse;
import com.aifactory.techshare.service.DonationQrcodeService;
import com.aifactory.techshare.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 用户端控制器
 * 包含反馈提交和打赏页面相关接口
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final DonationQrcodeService donationQrcodeService;

    // ==================== 反馈相关 ====================

    /**
     * 提交反馈
     *
     * @param request 反馈请求
     * @return 反馈响应
     */
    @PostMapping("/feedbacks")
    public Result<FeedbackResponse> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        log.info("提交反馈: name={}, email={}", request.getName(), request.getEmail());
        FeedbackResponse response = feedbackService.submitFeedback(request);
        return Result.success("提交成功，感谢您的反馈！", response);
    }

    // ==================== 打赏相关 ====================

    /**
     * 获取收款码列表（用户端，只返回展示的）
     *
     * @return 收款码列表
     */
    @GetMapping("/donation-qrcodes")
    public Result<List<DonationQrcodeResponse>> getDonationQrcodes() {
        log.info("获取收款码列表");
        List<DonationQrcodeResponse> qrcodes = donationQrcodeService.getShowQrcodeList();
        return Result.success(qrcodes);
    }

}
