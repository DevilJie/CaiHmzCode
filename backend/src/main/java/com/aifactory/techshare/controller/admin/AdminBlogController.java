package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.BlogCreateRequest;
import com.aifactory.techshare.dto.BlogDetailResponse;
import com.aifactory.techshare.dto.BlogResponse;
import com.aifactory.techshare.dto.BlogUpdateRequest;
import com.aifactory.techshare.service.BlogService;
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

/**
 * 博客管理控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/blogs")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
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
    public Result<PageResult<BlogResponse>> getBlogList(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Long categoryId,
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
    public Result<BlogDetailResponse> getBlogDetail(@PathVariable Long id) {
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
    public Result<BlogDetailResponse> createBlog(@Valid @RequestBody BlogCreateRequest request) {
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
    public Result<BlogDetailResponse> updateBlog(@PathVariable Long id,
                                                  @Valid @RequestBody BlogUpdateRequest request) {
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
    public Result<BlogDetailResponse> publishBlog(@PathVariable Long id) {
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
    public Result<BlogDetailResponse> unpublishBlog(@PathVariable Long id) {
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
    public Result<Void> deleteBlog(@PathVariable Long id) {
        log.info("删除博客: id={}", id);
        blogService.deleteBlog(id);
        return Result.success("删除成功", null);
    }

}
