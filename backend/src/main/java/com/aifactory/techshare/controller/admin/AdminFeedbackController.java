package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.FeedbackResponse;
import com.aifactory.techshare.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
@RestController
@RequestMapping("/api/v1/admin/feedbacks")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
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
    public Result<PageResult<FeedbackResponse>> getFeedbackList(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Integer isRead,
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
    public Result<FeedbackResponse> getFeedbackDetail(@PathVariable Long id) {
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
    public Result<Void> markAsRead(@PathVariable Long id) {
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
    public Result<Void> batchMarkAsRead(@RequestBody Map<String, List<Long>> request) {
        List<Long> ids = request.get("ids");
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
    public Result<Void> deleteFeedback(@PathVariable Long id) {
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
    public Result<Map<String, Long>> getUnreadCount() {
        long count = feedbackService.getUnreadCount();
        return Result.success(Map.of("count", count));
    }

}
