package com.aifactory.techshare.service;

import com.aifactory.techshare.dto.DashboardStatsResponse;
import com.aifactory.techshare.entity.Blog;
import com.aifactory.techshare.entity.Feedback;
import com.aifactory.techshare.entity.Project;
import com.aifactory.techshare.mapper.BlogMapper;
import com.aifactory.techshare.mapper.FeedbackMapper;
import com.aifactory.techshare.mapper.ProjectMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 仪表盘服务
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BlogMapper blogMapper;
    private final ProjectMapper projectMapper;
    private final FeedbackMapper feedbackMapper;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    /**
     * 获取仪表盘统计数据
     *
     * @return 统计数据
     */
    public DashboardStatsResponse getStats() {
        // 博客统计
        Long blogTotal = blogMapper.selectCount(new LambdaQueryWrapper<Blog>());
        Long blogPublished = blogMapper.selectCount(
                new LambdaQueryWrapper<Blog>().eq(Blog::getStatus, 1)
        );
        Long blogDraft = blogMapper.selectCount(
                new LambdaQueryWrapper<Blog>().eq(Blog::getStatus, 0)
        );

        DashboardStatsResponse.BlogStats blogStats = DashboardStatsResponse.BlogStats.builder()
                .total(blogTotal)
                .published(blogPublished)
                .draft(blogDraft)
                .build();

        // 项目统计
        Long projectTotal = projectMapper.selectCount(new LambdaQueryWrapper<Project>());
        Long projectVisible = projectMapper.selectCount(
                new LambdaQueryWrapper<Project>().eq(Project::getIsShow, 1)
        );

        DashboardStatsResponse.ProjectStats projectStats = DashboardStatsResponse.ProjectStats.builder()
                .total(projectTotal)
                .visible(projectVisible)
                .build();

        // 反馈统计
        Long feedbackTotal = feedbackMapper.selectCount(new LambdaQueryWrapper<Feedback>());
        Long feedbackUnread = feedbackMapper.selectCount(
                new LambdaQueryWrapper<Feedback>().eq(Feedback::getIsRead, 0)
        );

        DashboardStatsResponse.FeedbackStats feedbackStats = DashboardStatsResponse.FeedbackStats.builder()
                .total(feedbackTotal)
                .unread(feedbackUnread)
                .build();

        // 最新反馈列表（最近5条）
        List<Feedback> recentFeedbacks = feedbackMapper.selectList(
                new LambdaQueryWrapper<Feedback>()
                        .orderByDesc(Feedback::getCreateTime)
                        .last("LIMIT 5")
        );

        List<DashboardStatsResponse.FeedbackItem> feedbackItems = recentFeedbacks.stream()
                .map(this::convertToFeedbackItem)
                .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .blogStats(blogStats)
                .projectStats(projectStats)
                .feedbackStats(feedbackStats)
                .recentFeedbacks(feedbackItems)
                .build();
    }

    /**
     * 转换为反馈项
     */
    private DashboardStatsResponse.FeedbackItem convertToFeedbackItem(Feedback feedback) {
        // 截取内容前100字符
        String content = feedback.getContent();
        if (content != null && content.length() > 100) {
            content = content.substring(0, 100) + "...";
        }

        return DashboardStatsResponse.FeedbackItem.builder()
                .id(feedback.getId())
                .name(feedback.getName())
                .content(content)
                .isRead(feedback.getIsRead())
                .createTime(feedback.getCreateTime() != null ?
                        feedback.getCreateTime().format(DATE_FORMATTER) : null)
                .build();
    }

}
