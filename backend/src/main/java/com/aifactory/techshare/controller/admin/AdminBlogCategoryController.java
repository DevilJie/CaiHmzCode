package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.CategoryRequest;
import com.aifactory.techshare.dto.CategoryResponse;
import com.aifactory.techshare.service.BlogCategoryService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
@RestController
@RequestMapping("/api/v1/admin/blog-categories")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
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
    public Result<Page<CategoryResponse>> getCategoryList(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
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
    public Result<CategoryResponse> getCategoryDetail(@PathVariable Long id) {
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
    public Result<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
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
    public Result<CategoryResponse> updateCategory(@PathVariable Long id,
                                                    @Valid @RequestBody CategoryRequest request) {
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
    public Result<Void> deleteCategory(@PathVariable Long id) {
        log.info("删除分类: id={}", id);
        categoryService.deleteCategory(id);
        return Result.success("删除成功", null);
    }

}
