package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.BlogDetailResponse;
import com.aifactory.techshare.dto.BlogResponse;
import com.aifactory.techshare.dto.CategoryResponse;
import com.aifactory.techshare.dto.TagResponse;
import com.aifactory.techshare.service.BlogCategoryService;
import com.aifactory.techshare.service.BlogService;
import com.aifactory.techshare.service.BlogTagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
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
    public Result<PageResult<BlogResponse>> getBlogList(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long tagId,
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
    public Result<BlogDetailResponse> getBlogDetail(@PathVariable Long id) {
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
    public Result<Void> incrementViewCount(@PathVariable Long id) {
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
    public Result<List<CategoryResponse>> getCategoryList() {
        log.info("获取分类列表");
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return Result.success(categories);
    }

    /**
     * 获取标签列表
     *
     * @return 标签列表
     */
    @GetMapping("/blog-tags")
    public Result<List<TagResponse>> getTagList() {
        log.info("获取标签列表");
        List<TagResponse> tags = tagService.getAllTags();
        return Result.success(tags);
    }

}
