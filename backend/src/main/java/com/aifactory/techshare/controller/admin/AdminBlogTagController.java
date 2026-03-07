package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.TagRequest;
import com.aifactory.techshare.dto.TagResponse;
import com.aifactory.techshare.service.BlogTagService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 博客标签管理控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/admin/blog-tags")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "博客标签管理（管理端）", description = "博客标签的增删改查接口，需要 ADMIN 或 SUPER_ADMIN 角色")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminBlogTagController {

    private final BlogTagService tagService;

    /**
     * 获取标签列表（分页）
     *
     * @param pageNum  页码（默认1）
     * @param pageSize 每页数量（默认10）
     * @return 标签分页列表
     */
    @GetMapping
    @Operation(summary = "获取标签列表（分页）", description = "分页查询博客标签列表")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<Page<TagResponse>> getTagList(
            @Parameter(description = "页码，从1开始", example = "1")
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为1") int pageNum,
            @Parameter(description = "每页数量，最大100", example = "10")
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "每页数量最小为1") @Max(value = 100, message = "每页数量最大为100") int pageSize) {
        log.info("管理端获取标签列表: pageNum={}, pageSize={}", pageNum, pageSize);
        Page<TagResponse> result = tagService.getTagPage(pageNum, pageSize);
        return Result.success(result);
    }

    /**
     * 获取所有标签（不分页）
     *
     * @return 标签列表
     */
    @GetMapping("/all")
    @Operation(summary = "获取所有标签", description = "获取所有博客标签，不分页")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<List<TagResponse>> getAllTags() {
        log.info("管理端获取所有标签");
        List<TagResponse> tags = tagService.getAllTags();
        return Result.success(tags);
    }

    /**
     * 获取标签详情
     *
     * @param id 标签ID
     * @return 标签详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取标签详情", description = "根据ID获取标签详细信息")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "404", description = "标签不存在")
    public Result<TagResponse> getTagDetail(
            @Parameter(description = "标签ID", required = true, example = "1")
            @PathVariable @NotNull(message = "标签ID不能为空") Long id) {
        log.info("管理端获取标签详情: id={}", id);
        TagResponse tag = tagService.getTagById(id);
        return Result.success(tag);
    }

    /**
     * 创建标签
     *
     * @param request 标签请求
     * @return 标签详情
     */
    @PostMapping
    @Operation(summary = "创建标签", description = "创建新的博客标签")
    @ApiResponse(responseCode = "200", description = "创建成功")
    @ApiResponse(responseCode = "400", description = "参数验证失败或标签名已存在")
    public Result<TagResponse> createTag(
            @RequestBody(description = "标签信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody TagRequest request) {
        log.info("创建标签: name={}", request.getName());
        TagResponse tag = tagService.createTag(request);
        return Result.success("创建成功", tag);
    }

    /**
     * 更新标签
     *
     * @param id      标签ID
     * @param request 标签请求
     * @return 标签详情
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新标签", description = "更新标签名称等信息")
    @ApiResponse(responseCode = "200", description = "更新成功")
    @ApiResponse(responseCode = "404", description = "标签不存在")
    public Result<TagResponse> updateTag(
            @Parameter(description = "标签ID", required = true, example = "1")
            @PathVariable @NotNull(message = "标签ID不能为空") Long id,
            @RequestBody(description = "标签信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody TagRequest request) {
        log.info("更新标签: id={}, name={}", id, request.getName());
        TagResponse tag = tagService.updateTag(id, request);
        return Result.success("更新成功", tag);
    }

    /**
     * 删除标签
     *
     * @param id 标签ID
     * @return 成功响应
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除标签", description = "删除指定标签")
    @ApiResponse(responseCode = "200", description = "删除成功")
    @ApiResponse(responseCode = "404", description = "标签不存在")
    public Result<Void> deleteTag(
            @Parameter(description = "标签ID", required = true, example = "1")
            @PathVariable @NotNull(message = "标签ID不能为空") Long id) {
        log.info("删除标签: id={}", id);
        tagService.deleteTag(id);
        return Result.success("删除成功", null);
    }

}
