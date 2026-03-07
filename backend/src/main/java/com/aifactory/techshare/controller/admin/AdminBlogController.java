package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.BlogCreateRequest;
import com.aifactory.techshare.dto.BlogDetailResponse;
import com.aifactory.techshare.dto.BlogResponse;
import com.aifactory.techshare.dto.BlogUpdateRequest;
import com.aifactory.techshare.service.BlogService;
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

/**
 * 博客管理控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/admin/blogs")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "博客管理（管理端）", description = "博客的增删改查、发布/取消发布等管理接口，需要 ADMIN 或 SUPER_ADMIN 角色")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminBlogController {

    private final BlogService blogService;

    /**
     * 获取博客列表（管理端，包含草稿）
     *
     * @param pageNum    页码（默认1）
     * @param pageSize   每页数量（默认10）
     * @param status     状态（可选）
     * @param categoryId 分类ID（可选）
     * @param keyword    关键词（可选）
     * @return 博客分页列表
     */
    @GetMapping
    @Operation(summary = "获取博客列表", description = "分页查询所有博客，包含草稿状态，支持按状态、分类、关键词筛选")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<PageResult<BlogResponse>> getBlogList(
            @Parameter(description = "页码，从1开始", example = "1")
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为1") int pageNum,
            @Parameter(description = "每页数量，最大100", example = "10")
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "每页数量最小为1") @Max(value = 100, message = "每页数量最大为100") int pageSize,
            @Parameter(description = "状态：0-草稿，1-已发布", example = "1")
            @RequestParam(required = false) Integer status,
            @Parameter(description = "分类ID", example = "1")
            @RequestParam(required = false) Long categoryId,
            @Parameter(description = "搜索关键词", example = "Spring")
            @RequestParam(required = false) String keyword) {
        log.info("管理端获取博客列表: pageNum={}, pageSize={}, status={}, categoryId={}, keyword={}",
                pageNum, pageSize, status, categoryId, keyword);
        PageResult<BlogResponse> result = blogService.getBlogListForAdmin(pageNum, pageSize, status, categoryId, keyword);
        return Result.success(result);
    }

    /**
     * 获取博客详情（管理端）
     *
     * @param id 博客ID
     * @return 博客详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取博客详情", description = "获取博客完整信息，包含草稿状态的内容")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "404", description = "博客不存在")
    public Result<BlogDetailResponse> getBlogDetail(
            @Parameter(description = "博客ID", required = true, example = "1")
            @PathVariable @NotNull(message = "博客ID不能为空") Long id) {
        log.info("管理端获取博客详情: id={}", id);
        BlogDetailResponse blog = blogService.getBlogDetailForAdmin(id);
        return Result.success(blog);
    }

    /**
     * 创建博客
     *
     * @param request 创建请求
     * @return 博客详情
     */
    @PostMapping
    @Operation(summary = "创建博客", description = "创建新博客，默认为草稿状态")
    @ApiResponse(responseCode = "200", description = "创建成功")
    @ApiResponse(responseCode = "400", description = "参数验证失败")
    public Result<BlogDetailResponse> createBlog(
            @RequestBody(description = "博客信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody BlogCreateRequest request) {
        log.info("创建博客: title={}", request.getTitle());
        BlogDetailResponse blog = blogService.createBlog(request);
        return Result.success("创建成功", blog);
    }

    /**
     * 更新博客
     *
     * @param id      博客ID
     * @param request 更新请求
     * @return 博客详情
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新博客", description = "更新博客的内容、分类、标签等信息")
    @ApiResponse(responseCode = "200", description = "更新成功")
    @ApiResponse(responseCode = "404", description = "博客不存在")
    public Result<BlogDetailResponse> updateBlog(
            @Parameter(description = "博客ID", required = true, example = "1")
            @PathVariable @NotNull(message = "博客ID不能为空") Long id,
            @RequestBody(description = "博客信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody BlogUpdateRequest request) {
        log.info("更新博客: id={}", id);
        BlogDetailResponse blog = blogService.updateBlog(id, request);
        return Result.success("更新成功", blog);
    }

    /**
     * 发布博客
     *
     * @param id 博客ID
     * @return 博客详情
     */
    @PutMapping("/{id}/publish")
    @Operation(summary = "发布博客", description = "将草稿状态的博客发布，发布后用户端可见")
    @ApiResponse(responseCode = "200", description = "发布成功")
    @ApiResponse(responseCode = "404", description = "博客不存在")
    public Result<BlogDetailResponse> publishBlog(
            @Parameter(description = "博客ID", required = true, example = "1")
            @PathVariable @NotNull(message = "博客ID不能为空") Long id) {
        log.info("发布博客: id={}", id);
        BlogDetailResponse blog = blogService.publishBlog(id);
        return Result.success("发布成功", blog);
    }

    /**
     * 取消发布博客
     *
     * @param id 博客ID
     * @return 博客详情
     */
    @PutMapping("/{id}/unpublish")
    @Operation(summary = "取消发布博客", description = "将已发布的博客改为草稿状态，用户端将不可见")
    @ApiResponse(responseCode = "200", description = "取消发布成功")
    @ApiResponse(responseCode = "404", description = "博客不存在")
    public Result<BlogDetailResponse> unpublishBlog(
            @Parameter(description = "博客ID", required = true, example = "1")
            @PathVariable @NotNull(message = "博客ID不能为空") Long id) {
        log.info("取消发布博客: id={}", id);
        BlogDetailResponse blog = blogService.unpublishBlog(id);
        return Result.success("取消发布成功", blog);
    }

    /**
     * 删除博客
     *
     * @param id 博客ID
     * @return 成功响应
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除博客", description = "逻辑删除博客")
    @ApiResponse(responseCode = "200", description = "删除成功")
    @ApiResponse(responseCode = "404", description = "博客不存在")
    public Result<Void> deleteBlog(
            @Parameter(description = "博客ID", required = true, example = "1")
            @PathVariable @NotNull(message = "博客ID不能为空") Long id) {
        log.info("删除博客: id={}", id);
        blogService.deleteBlog(id);
        return Result.success("删除成功", null);
    }

}
