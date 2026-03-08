package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.DonationQrcodeResponse;
import com.aifactory.techshare.dto.FeedbackRequest;
import com.aifactory.techshare.dto.FeedbackResponse;
import com.aifactory.techshare.service.DonationQrcodeService;
import com.aifactory.techshare.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 用户端控制器
 * 包含反馈提交和打赏页面相关接口
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "反馈与打赏（用户端）", description = "用户反馈提交和打赏收款码接口，无需登录")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final DonationQrcodeService donationQrcodeService;

    // ==================== 反馈相关 ====================

    /**
     * 获取反馈列表（用户端）
     *
     * @param pageNum  页码（默认1）
     * @param pageSize 每页数量（默认10）
     * @param isRead   已读状态（可选，0: 未读, 1: 已读）
     * @param keyword  关键词（可选）
     * @return 反馈分页列表
     */
    @GetMapping("/feedbacks")
    @Operation(summary = "获取反馈列表", description = "分页查询用户反馈列表，支持按已读状态、关键词筛选")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<PageResult<FeedbackResponse>> getFeedbackList(
            @Parameter(description = "页码，从1开始", example = "1")
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为1") int pageNum,
            @Parameter(description = "每页数量，最大100", example = "10")
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "每页数量最小为1") @Max(value = 100, message = "每页数量最大为100") int pageSize,
            @Parameter(description = "已读状态：0-未读，1-已读", example = "0")
            @RequestParam(required = false) Integer isRead,
            @Parameter(description = "搜索关键词", example = "建议")
            @RequestParam(required = false) String keyword) {
        log.info("用户端获取反馈列表: pageNum={}, pageSize={}, isRead={}, keyword={}",
                pageNum, pageSize, isRead, keyword);
        PageResult<FeedbackResponse> result = feedbackService.getFeedbackList(pageNum, pageSize, isRead, keyword);
        return Result.success(result);
    }

    /**
     * 提交反馈
     *
     * @param request 反馈请求
     * @return 反馈响应
     */
    @PostMapping("/feedbacks")
    @Operation(summary = "提交用户反馈", description = "用户提交意见反馈，包含姓名、邮箱、内容等信息")
    @ApiResponse(responseCode = "200", description = "提交成功")
    @ApiResponse(responseCode = "400", description = "参数验证失败")
    public Result<FeedbackResponse> submitFeedback(
            @RequestBody(description = "反馈信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody FeedbackRequest request) {
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
    @Operation(summary = "获取打赏收款码列表", description = "获取所有设置为展示的打赏收款码（如微信、支付宝等）")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<List<DonationQrcodeResponse>> getDonationQrcodes() {
        log.info("获取收款码列表");
        List<DonationQrcodeResponse> qrcodes = donationQrcodeService.getShowQrcodeList();
        return Result.success(qrcodes);
    }

}
