package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.TagRequest;
import com.aifactory.techshare.dto.TagResponse;
import com.aifactory.techshare.service.BlogTagService;
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
 * 博客标签管理控制器（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/blog-tags")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
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
    public Result<Page<TagResponse>> getTagList(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
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
    public Result<TagResponse> getTagDetail(@PathVariable Long id) {
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
    public Result<TagResponse> createTag(@Valid @RequestBody TagRequest request) {
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
    public Result<TagResponse> updateTag(@PathVariable Long id,
                                          @Valid @RequestBody TagRequest request) {
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
    public Result<Void> deleteTag(@PathVariable Long id) {
        log.info("删除标签: id={}", id);
        tagService.deleteTag(id);
        return Result.success("删除成功", null);
    }

}
