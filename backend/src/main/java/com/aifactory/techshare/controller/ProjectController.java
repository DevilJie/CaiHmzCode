package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.ProjectDetailResponse;
import com.aifactory.techshare.dto.ProjectListRequest;
import com.aifactory.techshare.dto.ProjectResponse;
import com.aifactory.techshare.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户端项目控制器
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    /**
     * 获取项目列表（分页，只返回显示的项目）
     *
     * @param request 查询参数
     * @return 分页项目列表
     */
    @GetMapping
    public Result<PageResult<ProjectResponse>> getProjectList(@Valid ProjectListRequest request) {
        log.info("用户端查询项目列表: pageNum={}, pageSize={}, keyword={}, techTag={}",
                request.getPageNum(), request.getPageSize(), request.getKeyword(), request.getTechTag());
        PageResult<ProjectResponse> result = projectService.getUserProjectList(request);
        return Result.success(result);
    }

    /**
     * 获取项目详情（含README）
     *
     * @param id 项目ID
     * @return 项目详情
     */
    @GetMapping("/{id}")
    public Result<ProjectDetailResponse> getProjectDetail(@PathVariable Long id) {
        log.info("用户端查询项目详情: id={}", id);
        ProjectDetailResponse project = projectService.getUserProjectDetail(id);
        return Result.success(project);
    }

    /**
     * 增加项目浏览次数
     *
     * @param id 项目ID
     * @return 成功响应
     */
    @PostMapping("/{id}/view")
    public Result<Void> incrementViewCount(@PathVariable Long id) {
        log.info("增加项目浏览次数: id={}", id);
        projectService.incrementViewCount(id);
        return Result.success();
    }

}
