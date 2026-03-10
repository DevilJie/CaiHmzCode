package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.ProjectDetailResponse;
import com.aifactory.techshare.dto.ProjectListRequest;
import com.aifactory.techshare.dto.ProjectResponse;
import com.aifactory.techshare.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 用户端项目控制器
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "项目管理（用户端）", description = "项目列表展示、详情查看等用户端接口，无需登录")
public class ProjectController {

    private final ProjectService projectService;

    /**
     * 获取项目列表（分页，只返回显示的项目）
     *
     * @param request 查询参数
     * @return 分页项目列表
     */
    @GetMapping
    @Operation(summary = "获取项目列表", description = "分页查询项目列表，只返回已设置为显示的项目")
    @ApiResponse(responseCode = "200", description = "查询成功",
            content = @Content(schema = @Schema(implementation = Result.class)))
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
    @Operation(summary = "获取项目详情", description = "获取项目详细信息，包含 README 内容")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "404", description = "项目不存在")
    public Result<ProjectDetailResponse> getProjectDetail(
            @Parameter(description = "项目ID", required = true, example = "1")
            @PathVariable @NotNull(message = "项目ID不能为空") Long id) {
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
    @Operation(summary = "增加项目浏览次数", description = "增加指定项目的浏览次数统计")
    @ApiResponse(responseCode = "200", description = "操作成功")
    public Result<Void> incrementViewCount(
            @Parameter(description = "项目ID", required = true, example = "1")
            @PathVariable @NotNull(message = "项目ID不能为空") Long id) {
        log.info("增加项目浏览次数: id={}", id);
        projectService.incrementViewCount(id);
        return Result.success();
    }

    /**
     * 获取所有技术栈列表
     *
     * @return 技术栈列表
     */
    @GetMapping("/tech-stacks")
    @Operation(summary = "获取技术栈列表", description = "获取所有项目使用的技术栈列表（去重）")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<List<String>> getTechStacks() {
        log.info("查询技术栈列表");
        List<String> techStacks = projectService.getAllTechStacks();
        return Result.success(techStacks);
    }

}
