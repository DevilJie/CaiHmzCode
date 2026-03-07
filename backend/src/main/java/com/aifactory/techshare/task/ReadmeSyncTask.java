package com.aifactory.techshare.task;

import com.aifactory.techshare.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * README同步定时任务
 * 每天凌晨2点同步所有项目的README
 *
 * @author AI Factory
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReadmeSyncTask {

    private final ProjectService projectService;

    /**
     * 每天凌晨2点执行README同步
     * cron表达式：秒 分 时 日 月 周
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void syncReadmes() {
        log.info("========== 开始执行README同步定时任务 ==========");
        try {
            projectService.syncAllReadmes();
            log.info("========== README同步定时任务执行完成 ==========");
        } catch (Exception e) {
            log.error("README同步定时任务执行失败: {}", e.getMessage(), e);
        }
    }

}
