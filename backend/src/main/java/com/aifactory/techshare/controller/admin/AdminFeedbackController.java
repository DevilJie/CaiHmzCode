package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.FeedbackResponse;
import com.aifactory.techshare.exception.BusinessException;
import com.aifactory.techshare.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 反馈管理控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/admin/feedbacks")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "反馈管理（管理端）", description = "用户反馈的查看、标记已读、删除等管理接口，需要 ADMIN 或 SUPER_ADMIN 角色")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminFeedbackController {

    private final FeedbackService feedbackService;

    /**
     * 获取反馈列表
     *
     * @param pageNum  页码（默认1）
     * @param pageSize 每页数量（默认10）
     * @param isRead   已读状态（可选，0: 未读, 1: 已读）
     * @param keyword  关键词（可选）
     * @return 反馈分页列表
     */
    @GetMapping
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
        log.info("管理端获取反馈列表: pageNum={}, pageSize={}, isRead={}, keyword={}",
                pageNum, pageSize, isRead, keyword);
        PageResult<FeedbackResponse> result = feedbackService.getFeedbackList(pageNum, pageSize, isRead, keyword);
        return Result.success(result);
    }

    /**
     * 获取反馈详情
     *
     * @param id 反馈ID
     * @return 反馈详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取反馈详情", description = "根据ID获取反馈详细信息")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "404", description = "反馈不存在")
    public Result<FeedbackResponse> getFeedbackDetail(
            @Parameter(description = "反馈ID", required = true, example = "1")
            @PathVariable @NotNull(message = "反馈ID不能为空") Long id) {
        log.info("管理端获取反馈详情: id={}", id);
        FeedbackResponse feedback = feedbackService.getFeedbackDetail(id);
        return Result.success(feedback);
    }

    /**
     * 标记反馈已读
     *
     * @param id 反馈ID
     * @return 成功响应
     */
    @PutMapping("/{id}/read")
    @Operation(summary = "标记反馈已读", description = "将指定反馈标记为已读状态")
    @ApiResponse(responseCode = "200", description = "操作成功")
    @ApiResponse(responseCode = "404", description = "反馈不存在")
    public Result<Void> markAsRead(
            @Parameter(description = "反馈ID", required = true, example = "1")
            @PathVariable @NotNull(message = "反馈ID不能为空") Long id) {
        log.info("标记反馈已读: id={}", id);
        feedbackService.markAsRead(id);
        return Result.success("已标记为已读", null);
    }

    /**
     * 批量标记已读
     *
     * @param request 包含ids列表的请求体
     * @return 成功响应
     */
    @PutMapping("/batch-read")
    @Operation(summary = "批量标记已读", description = "批量将多个反馈标记为已读状态")
    @ApiResponse(responseCode = "200", description = "操作成功")
    @ApiResponse(responseCode = "400", description = "反馈ID列表不能为空")
    public Result<Void> batchMarkAsRead(
            @RequestBody(description = "反馈ID列表", required = true)
            @org.springframework.web.bind.annotation.RequestBody Map<String, List<Long>> request) {
        List<Long> ids = request.get("ids");
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException(400, "反馈ID列表不能为空");
        }
        log.info("批量标记反馈已读: ids={}", ids);
        feedbackService.batchMarkAsRead(ids);
        return Result.success("批量标记成功", null);
    }

    /**
     * 删除反馈
     *
     * @param id 反馈ID
     * @return 成功响应
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除反馈", description = "删除指定反馈")
    @ApiResponse(responseCode = "200", description = "删除成功")
    @ApiResponse(responseCode = "404", description = "反馈不存在")
    public Result<Void> deleteFeedback(
            @Parameter(description = "反馈ID", required = true, example = "1")
            @PathVariable @NotNull(message = "反馈ID不能为空") Long id) {
        log.info("删除反馈: id={}", id);
        feedbackService.deleteFeedback(id);
        return Result.success("删除成功", null);
    }

    /**
     * 获取未读反馈数量
     *
     * @return 未读数量
     */
    @GetMapping("/unread-count")
    @Operation(summary = "获取未读反馈数量", description = "获取当前未读反馈的总数")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<Map<String, Long>> getUnreadCount() {
        long count = feedbackService.getUnreadCount();
        return Result.success(Map.of("count", count));
    }

}
