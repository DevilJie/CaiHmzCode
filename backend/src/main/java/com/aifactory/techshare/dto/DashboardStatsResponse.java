package com.aifactory.techshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * 仪表盘统计数据响应DTO
 *
 * @author AI Factory
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 博客统计
     */
    private BlogStats blogStats;

    /**
     * 项目统计
     */
    private ProjectStats projectStats;

    /**
     * 反馈统计
     */
    private FeedbackStats feedbackStats;

    /**
     * 最新反馈列表
     */
    private List<FeedbackItem> recentFeedbacks;

    /**
     * 博客统计
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BlogStats implements Serializable {

        private static final long serialVersionUID = 1L;

        /**
         * 博客总数
         */
        private Long total;

        /**
         * 已发布数
         */
        private Long published;

        /**
         * 草稿数
         */
        private Long draft;
    }

    /**
     * 项目统计
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectStats implements Serializable {

        private static final long serialVersionUID = 1L;

        /**
         * 项目总数
         */
        private Long total;

        /**
         * 已展示数
         */
        private Long visible;

    }

    /**
     * 反馈统计
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedbackStats implements Serializable {

        private static final long serialVersionUID = 1L;

        /**
         * 反馈总数
         */
        private Long total;

        /**
         * 未读数
         */
        private Long unread;

    }

    /**
     * 反馈项
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedbackItem implements Serializable {

        private static final long serialVersionUID = 1L;

        /**
         * 反馈ID
         */
        private Long id;

        /**
         * 姓名
         */
        private String name;

        /**
         * 内容（截取前100字符）
         */
        private String content;

        /**
         * 是否已读
         */
        private Integer isRead;

        /**
         * 创建时间
         */
        private String createTime;

    }

}
