package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.AdminProjectListRequest;
import com.aifactory.techshare.dto.ProjectCreateRequest;
import com.aifactory.techshare.dto.ProjectResponse;
import com.aifactory.techshare.dto.ProjectUpdateRequest;
import com.aifactory.techshare.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 管理端项目控制器
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/admin/projects")
@RequiredArgsConstructor
@Tag(name = "项目管理（管理端）", description = "项目的增删改查、README同步等管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminProjectController {

    private final ProjectService projectService;

    /**
     * 获取项目列表（分页、搜索）
     *
     * @param request 查询参数
     * @return 分页结果
     */
    @GetMapping
    @Operation(summary = "获取项目列表", description = "分页查询所有项目，支持关键词搜索和显示状态筛选")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<PageResult<ProjectResponse>> getProjectList(@Valid AdminProjectListRequest request) {
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
    @Operation(summary = "获取项目详情", description = "根据ID获取项目详细信息")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "404", description = "项目不存在")
    public Result<ProjectResponse> getProject(
            @Parameter(description = "项目ID", required = true, example = "1")
            @PathVariable @NotNull(message = "项目ID不能为空") Long id) {
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
    @Operation(summary = "新增项目", description = "创建新项目，可设置基本信息和 GitHub 仓库地址")
    @ApiResponse(responseCode = "200", description = "创建成功")
    @ApiResponse(responseCode = "400", description = "参数验证失败")
    public Result<ProjectResponse> createProject(
            @RequestBody(description = "项目信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody ProjectCreateRequest request) {
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
    @Operation(summary = "更新项目", description = "更新项目的基本信息")
    @ApiResponse(responseCode = "200", description = "更新成功")
    @ApiResponse(responseCode = "404", description = "项目不存在")
    public Result<ProjectResponse> updateProject(
            @Parameter(description = "项目ID", required = true, example = "1")
            @PathVariable @NotNull(message = "项目ID不能为空") Long id,
            @RequestBody(description = "项目信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody ProjectUpdateRequest request) {
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
    @Operation(summary = "删除项目", description = "逻辑删除项目，不会真正删除数据")
    @ApiResponse(responseCode = "200", description = "删除成功")
    @ApiResponse(responseCode = "404", description = "项目不存在")
    public Result<Void> deleteProject(
            @Parameter(description = "项目ID", required = true, example = "1")
            @PathVariable @NotNull(message = "项目ID不能为空") Long id) {
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
    @Operation(summary = "同步README", description = "从 GitHub 仓库手动同步项目的 README 文档")
    @ApiResponse(responseCode = "200", description = "同步成功")
    @ApiResponse(responseCode = "400", description = "同步失败，请检查仓库地址")
    public Result<Void> syncReadme(
            @Parameter(description = "项目ID", required = true, example = "1")
            @PathVariable @NotNull(message = "项目ID不能为空") Long id) {
        log.info("管理端同步README: id={}", id);
        boolean success = projectService.syncReadme(id);
        if (success) {
            return Result.success("README同步成功", null);
        } else {
            return Result.failed("README同步失败");
        }
    }

}
