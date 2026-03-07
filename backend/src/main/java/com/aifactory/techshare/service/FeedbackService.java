package com.aifactory.techshare.service;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.dto.FeedbackRequest;
import com.aifactory.techshare.dto.FeedbackResponse;
import com.aifactory.techshare.entity.Feedback;
import com.aifactory.techshare.exception.BusinessException;
import com.aifactory.techshare.mapper.FeedbackMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 意见反馈服务
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackMapper feedbackMapper;

    /**
     * 提交反馈（用户端）
     *
     * @param request 反馈请求
     * @return 反馈响应
     */
    @Transactional(rollbackFor = Exception.class)
    public FeedbackResponse submitFeedback(FeedbackRequest request) {
        Feedback feedback = new Feedback();
        feedback.setName(request.getName());
        feedback.setEmail(request.getEmail());
        feedback.setQq(request.getQq());
        feedback.setWechat(request.getWechat());
        feedback.setContent(request.getContent());
        feedback.setIsRead(0); // 默认未读

        feedbackMapper.insert(feedback);
        log.info("提交反馈成功: id={}, name={}", feedback.getId(), feedback.getName());

        return convertToResponse(feedback);
    }

    /**
     * 获取反馈列表（管理端）
     *
     * @param pageNum  页码
     * @param pageSize 每页数量
     * @param isRead   已读状态（可选）
     * @param keyword  关键词（可选）
     * @return 分页结果
     */
    public PageResult<FeedbackResponse> getFeedbackList(int pageNum, int pageSize,
                                                         Integer isRead, String keyword) {
        // 构建查询条件
        LambdaQueryWrapper<Feedback> queryWrapper = new LambdaQueryWrapper<Feedback>()
                .orderByDesc(Feedback::getCreateTime);

        // 已读状态筛选
        if (isRead != null) {
            queryWrapper.eq(Feedback::getIsRead, isRead);
        }

        // 关键词搜索（搜索姓名、邮箱、内容）
        if (StringUtils.hasText(keyword)) {
            queryWrapper.and(w -> w
                    .like(Feedback::getName, keyword)
                    .or()
                    .like(Feedback::getEmail, keyword)
                    .or()
                    .like(Feedback::getContent, keyword)
            );
        }

        // 分页查询
        Page<Feedback> page = new Page<>(pageNum, pageSize);
        Page<Feedback> feedbackPage = feedbackMapper.selectPage(page, queryWrapper);

        // 转换为响应DTO
        List<FeedbackResponse> feedbackResponses = feedbackPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PageResult<>(feedbackResponses, feedbackPage.getTotal(), pageNum, pageSize);
    }

    /**
     * 获取反馈详情（管理端）
     *
     * @param id 反馈ID
     * @return 反馈详情
     */
    public FeedbackResponse getFeedbackDetail(Long id) {
        Feedback feedback = feedbackMapper.selectById(id);
        if (feedback == null) {
            throw new BusinessException(404, "反馈不存在");
        }
        return convertToResponse(feedback);
    }

    /**
     * 标记反馈已读
     *
     * @param id 反馈ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void markAsRead(Long id) {
        Feedback feedback = feedbackMapper.selectById(id);
        if (feedback == null) {
            throw new BusinessException(404, "反馈不存在");
        }

        feedbackMapper.update(null, new LambdaUpdateWrapper<Feedback>()
                .eq(Feedback::getId, id)
                .set(Feedback::getIsRead, 1)
        );
        log.info("标记反馈已读: id={}", id);
    }

    /**
     * 删除反馈
     *
     * @param id 反馈ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteFeedback(Long id) {
        Feedback feedback = feedbackMapper.selectById(id);
        if (feedback == null) {
            throw new BusinessException(404, "反馈不存在");
        }

        feedbackMapper.deleteById(id);
        log.info("删除反馈成功: id={}", id);
    }

    /**
     * 批量标记已读
     *
     * @param ids 反馈ID列表
     */
    @Transactional(rollbackFor = Exception.class)
    public void batchMarkAsRead(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        feedbackMapper.update(null, new LambdaUpdateWrapper<Feedback>()
                .in(Feedback::getId, ids)
                .set(Feedback::getIsRead, 1)
        );
        log.info("批量标记反馈已读: ids={}", ids);
    }

    /**
     * 获取未读反馈数量
     *
     * @return 未读数量
     */
    public long getUnreadCount() {
        return feedbackMapper.selectCount(
                new LambdaQueryWrapper<Feedback>()
                        .eq(Feedback::getIsRead, 0)
        );
    }

    /**
     * 转换为响应DTO
     */
    private FeedbackResponse convertToResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .name(feedback.getName())
                .email(feedback.getEmail())
                .qq(feedback.getQq())
                .wechat(feedback.getWechat())
                .content(feedback.getContent())
                .isRead(feedback.getIsRead())
                .createTime(feedback.getCreateTime())
                .build();
    }

}
