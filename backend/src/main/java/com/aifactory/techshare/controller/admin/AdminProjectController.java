package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.AdminProjectListRequest;
import com.aifactory.techshare.dto.ProjectCreateRequest;
import com.aifactory.techshare.dto.ProjectResponse;
import com.aifactory.techshare.dto.ProjectUpdateRequest;
import com.aifactory.techshare.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 管理端项目控制器
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/projects")
@RequiredArgsConstructor
public class AdminProjectController {

    private final ProjectService projectService;

    /**
     * 获取项目列表（分页、搜索）
     *
     * @param request 查询参数
     * @return 分页结果
     */
    @GetMapping
    public Result<PageResult<ProjectResponse>> getProjectList(AdminProjectListRequest request) {
        log.info("管理端查询项目列表: pageNum={}, pageSize={}, keyword={}, isShow={}",
                request.getPageNum(), request.getPageSize(), request.getKeyword(), request.getIsShow());
        PageResult<ProjectResponse> result = projectService.getAdminProjectList(request);
        return Result.success(result);
    }

    /**
     * 获取项目详情
     *
     * @param id 项目ID
     * @return 项目详情
     */
    @GetMapping("/{id}")
    public Result<ProjectResponse> getProject(@PathVariable Long id) {
        log.info("管理端查询项目详情: id={}", id);
        ProjectResponse project = projectService.getProjectById(id);
        return Result.success(project);
    }

    /**
     * 新增项目
     *
     * @param request 新增请求
     * @return 项目详情
     */
    @PostMapping
    public Result<ProjectResponse> createProject(@Valid @RequestBody ProjectCreateRequest request) {
        log.info("管理端新增项目: name={}", request.getName());
        ProjectResponse project = projectService.createProject(request);
        return Result.success("项目创建成功", project);
    }

    /**
     * 更新项目
     *
     * @param id      项目ID
     * @param request 更新请求
     * @return 项目详情
     */
    @PutMapping("/{id}")
    public Result<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectUpdateRequest request) {
        log.info("管理端更新项目: id={}", id);
        ProjectResponse project = projectService.updateProject(id, request);
        return Result.success("项目更新成功", project);
    }

    /**
     * 删除项目（逻辑删除）
     *
     * @param id 项目ID
     * @return 成功响应
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteProject(@PathVariable Long id) {
        log.info("管理端删除项目: id={}", id);
        projectService.deleteProject(id);
        return Result.success("项目删除成功", null);
    }

    /**
     * 手动同步README
     *
     * @param id 项目ID
     * @return 成功响应
     */
    @PostMapping("/{id}/sync-readme")
    public Result<Void> syncReadme(@PathVariable Long id) {
        log.info("管理端同步README: id={}", id);
        boolean success = projectService.syncReadme(id);
        if (success) {
            return Result.success("README同步成功", null);
        } else {
            return Result.failed("README同步失败");
        }
    }

}
