package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.CategoryRequest;
import com.aifactory.techshare.dto.CategoryResponse;
import com.aifactory.techshare.service.BlogCategoryService;
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
 * 博客分类管理控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/admin/blog-categories")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "博客分类管理（管理端）", description = "博客分类的增删改查接口，需要 ADMIN 或 SUPER_ADMIN 角色")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminBlogCategoryController {

    private final BlogCategoryService categoryService;

    /**
     * 获取分类列表（分页）
     *
     * @param pageNum  页码（默认1）
     * @param pageSize 每页数量（默认10）
     * @return 分类分页列表
     */
    @GetMapping
    @Operation(summary = "获取分类列表（分页）", description = "分页查询博客分类列表")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<Page<CategoryResponse>> getCategoryList(
            @Parameter(description = "页码，从1开始", example = "1")
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为1") int pageNum,
            @Parameter(description = "每页数量，最大100", example = "10")
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "每页数量最小为1") @Max(value = 100, message = "每页数量最大为100") int pageSize) {
        log.info("管理端获取分类列表: pageNum={}, pageSize={}", pageNum, pageSize);
        Page<CategoryResponse> result = categoryService.getCategoryPage(pageNum, pageSize);
        return Result.success(result);
    }

    /**
     * 获取所有分类（不分页）
     *
     * @return 分类列表
     */
    @GetMapping("/all")
    @Operation(summary = "获取所有分类", description = "获取所有博客分类，不分页")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<List<CategoryResponse>> getAllCategories() {
        log.info("管理端获取所有分类");
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return Result.success(categories);
    }

    /**
     * 获取分类详情
     *
     * @param id 分类ID
     * @return 分类详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取分类详情", description = "根据ID获取分类详细信息")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "404", description = "分类不存在")
    public Result<CategoryResponse> getCategoryDetail(
            @Parameter(description = "分类ID", required = true, example = "1")
            @PathVariable @NotNull(message = "分类ID不能为空") Long id) {
        log.info("管理端获取分类详情: id={}", id);
        CategoryResponse category = categoryService.getCategoryById(id);
        return Result.success(category);
    }

    /**
     * 创建分类
     *
     * @param request 分类请求
     * @return 分类详情
     */
    @PostMapping
    @Operation(summary = "创建分类", description = "创建新的博客分类")
    @ApiResponse(responseCode = "200", description = "创建成功")
    @ApiResponse(responseCode = "400", description = "参数验证失败或分类名已存在")
    public Result<CategoryResponse> createCategory(
            @RequestBody(description = "分类信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody CategoryRequest request) {
        log.info("创建分类: name={}", request.getName());
        CategoryResponse category = categoryService.createCategory(request);
        return Result.success("创建成功", category);
    }

    /**
     * 更新分类
     *
     * @param id      分类ID
     * @param request 分类请求
     * @return 分类详情
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新分类", description = "更新分类名称等信息")
    @ApiResponse(responseCode = "200", description = "更新成功")
    @ApiResponse(responseCode = "404", description = "分类不存在")
    public Result<CategoryResponse> updateCategory(
            @Parameter(description = "分类ID", required = true, example = "1")
            @PathVariable @NotNull(message = "分类ID不能为空") Long id,
            @RequestBody(description = "分类信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody CategoryRequest request) {
        log.info("更新分类: id={}, name={}", id, request.getName());
        CategoryResponse category = categoryService.updateCategory(id, request);
        return Result.success("更新成功", category);
    }

    /**
     * 删除分类
     *
     * @param id 分类ID
     * @return 成功响应
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类", description = "删除指定分类，如果分类下有博客则无法删除")
    @ApiResponse(responseCode = "200", description = "删除成功")
    @ApiResponse(responseCode = "400", description = "分类下存在博客，无法删除")
    @ApiResponse(responseCode = "404", description = "分类不存在")
    public Result<Void> deleteCategory(
            @Parameter(description = "分类ID", required = true, example = "1")
            @PathVariable @NotNull(message = "分类ID不能为空") Long id) {
        log.info("删除分类: id={}", id);
        categoryService.deleteCategory(id);
        return Result.success("删除成功", null);
    }

}
