package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.BlogDetailResponse;
import com.aifactory.techshare.dto.BlogResponse;
import com.aifactory.techshare.dto.CategoryResponse;
import com.aifactory.techshare.dto.CategoryTreeResponse;
import com.aifactory.techshare.dto.TagResponse;
import com.aifactory.techshare.service.BlogCategoryService;
import com.aifactory.techshare.service.BlogService;
import com.aifactory.techshare.service.BlogTagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 博客控制器（用户端）
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "博客管理（用户端）", description = "博客列表、详情、分类、标签等用户端接口，无需登录")
public class BlogController {

    private final BlogService blogService;
    private final BlogCategoryService categoryService;
    private final BlogTagService tagService;

    /**
     * 获取博客列表
     *
     * @param pageNum    页码（默认1）
     * @param pageSize   每页数量（默认10）
     * @param categoryId 分类ID（可选）
     * @param tagId      标签ID（可选）
     * @param keyword    关键词（可选）
     * @return 博客分页列表
     */
    @GetMapping("/blogs")
    @Operation(summary = "获取博客列表", description = "分页查询已发布的博客列表，支持按分类、标签、关键词筛选")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<PageResult<BlogResponse>> getBlogList(
            @Parameter(description = "页码，从1开始", example = "1")
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为1") int pageNum,
            @Parameter(description = "每页数量，最大100", example = "10")
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "每页数量最小为1") @Max(value = 100, message = "每页数量最大为100") int pageSize,
            @Parameter(description = "分类ID，可选", example = "1")
            @RequestParam(required = false) Long categoryId,
            @Parameter(description = "标签ID，可选", example = "1")
            @RequestParam(required = false) Long tagId,
            @Parameter(description = "搜索关键词，可选", example = "Spring")
            @RequestParam(required = false) String keyword) {
        log.info("获取博客列表: pageNum={}, pageSize={}, categoryId={}, tagId={}, keyword={}",
                pageNum, pageSize, categoryId, tagId, keyword);
        PageResult<BlogResponse> result = blogService.getPublishedBlogList(pageNum, pageSize, categoryId, tagId, keyword);
        return Result.success(result);
    }

    /**
     * 获取博客详情
     *
     * @param id 博客ID
     * @return 博客详情
     */
    @GetMapping("/blogs/{id}")
    @Operation(summary = "获取博客详情", description = "获取博客详细信息，包含完整内容")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "404", description = "博客不存在")
    public Result<BlogDetailResponse> getBlogDetail(
            @Parameter(description = "博客ID", required = true, example = "1")
            @PathVariable @NotNull(message = "博客ID不能为空") Long id) {
        log.info("获取博客详情: id={}", id);
        BlogDetailResponse blog = blogService.getBlogDetail(id);
        return Result.success(blog);
    }

    /**
     * 增加浏览次数
     *
     * @param id 博客ID
     * @return 成功响应
     */
    @PostMapping("/blogs/{id}/view")
    @Operation(summary = "增加博客浏览次数", description = "增加指定博客的浏览次数统计")
    @ApiResponse(responseCode = "200", description = "操作成功")
    public Result<Void> incrementViewCount(
            @Parameter(description = "博客ID", required = true, example = "1")
            @PathVariable @NotNull(message = "博客ID不能为空") Long id) {
        log.info("增加浏览次数: id={}", id);
        blogService.incrementViewCount(id);
        return Result.success();
    }

    /**
     * 获取分类列表
     *
     * @return 分类列表
     */
    @GetMapping("/blog-categories")
    @Operation(summary = "获取博客分类列表", description = "获取所有博客分类")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<List<CategoryResponse>> getCategoryList() {
        log.info("获取分类列表");
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return Result.success(categories);
    }

    /**
     * 获取分类树
     *
     * @return 分类树列表
     */
    @GetMapping("/blog-categories/tree")
    @Operation(summary = "获取博客分类树", description = "获取树形结构的博客分类")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<List<CategoryTreeResponse>> getCategoryTree() {
        log.info("获取分类树");
        List<CategoryTreeResponse> tree = categoryService.getCategoryTree();
        return Result.success(tree);
    }

    /**
     * 获取标签列表
     *
     * @return 标签列表
     */
    @GetMapping("/blog-tags")
    @Operation(summary = "获取博客标签列表", description = "获取所有博客标签")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<List<TagResponse>> getTagList() {
        log.info("获取标签列表");
        List<TagResponse> tags = tagService.getAllTags();
        return Result.success(tags);
    }

}
