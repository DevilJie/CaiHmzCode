package com.aifactory.techshare.service;

import com.aifactory.techshare.dto.CategoryRequest;
import com.aifactory.techshare.dto.CategoryResponse;
import com.aifactory.techshare.entity.BlogCategory;
import com.aifactory.techshare.exception.BusinessException;
import com.aifactory.techshare.mapper.BlogCategoryMapper;
import com.aifactory.techshare.mapper.BlogMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 博客分类服务
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BlogCategoryService {

    private final BlogCategoryMapper categoryMapper;
    private final BlogMapper blogMapper;

    /**
     * 获取所有分类列表（用户端）
     *
     * @return 分类列表
     */
    public List<CategoryResponse> getAllCategories() {
        List<BlogCategory> categories = categoryMapper.selectList(
                new LambdaQueryWrapper<BlogCategory>()
                        .orderByAsc(BlogCategory::getSortOrder)
                        .orderByDesc(BlogCategory::getCreateTime)
        );

        return categories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 分页获取分类列表（管理端）
     *
     * @param pageNum  页码
     * @param pageSize 每页数量
     * @return 分页结果
     */
    public Page<CategoryResponse> getCategoryPage(int pageNum, int pageSize) {
        Page<BlogCategory> page = new Page<>(pageNum, pageSize);
        Page<BlogCategory> categoryPage = categoryMapper.selectPage(page,
                new LambdaQueryWrapper<BlogCategory>()
                        .orderByAsc(BlogCategory::getSortOrder)
                        .orderByDesc(BlogCategory::getCreateTime)
        );

        Page<CategoryResponse> responsePage = new Page<>(pageNum, pageSize, categoryPage.getTotal());
        responsePage.setRecords(
                categoryPage.getRecords().stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList())
        );
        return responsePage;
    }

    /**
     * 根据ID获取分类
     *
     * @param id 分类ID
     * @return 分类详情
     */
    public CategoryResponse getCategoryById(Long id) {
        BlogCategory category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(404, "分类不存在");
        }
        return convertToResponse(category);
    }

    /**
     * 创建分类
     *
     * @param request 分类请求
     * @return 创建后的分类
     */
    @Transactional(rollbackFor = Exception.class)
    public CategoryResponse createCategory(CategoryRequest request) {
        // 检查分类名称是否已存在
        Long count = categoryMapper.selectCount(
                new LambdaQueryWrapper<BlogCategory>()
                        .eq(BlogCategory::getName, request.getName())
        );
        if (count > 0) {
            throw new BusinessException(400, "分类名称已存在");
        }

        BlogCategory category = new BlogCategory();
        category.setName(request.getName());
        category.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);

        categoryMapper.insert(category);
        log.info("创建分类成功: {}", category.getName());

        return convertToResponse(category);
    }

    /**
     * 更新分类
     *
     * @param id      分类ID
     * @param request 分类请求
     * @return 更新后的分类
     */
    @Transactional(rollbackFor = Exception.class)
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        BlogCategory category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(404, "分类不存在");
        }

        // 检查分类名称是否与其他分类重复
        Long count = categoryMapper.selectCount(
                new LambdaQueryWrapper<BlogCategory>()
                        .eq(BlogCategory::getName, request.getName())
                        .ne(BlogCategory::getId, id)
        );
        if (count > 0) {
            throw new BusinessException(400, "分类名称已存在");
        }

        category.setName(request.getName());
        if (request.getSortOrder() != null) {
            category.setSortOrder(request.getSortOrder());
        }

        categoryMapper.updateById(category);
        log.info("更新分类成功: {}", category.getName());

        return convertToResponse(category);
    }

    /**
     * 删除分类
     *
     * @param id 分类ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteCategory(Long id) {
        BlogCategory category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(404, "分类不存在");
        }

        // 检查该分类下是否有博客
        Long blogCount = blogMapper.selectCount(
                new LambdaQueryWrapper<com.aifactory.techshare.entity.Blog>()
                        .eq(com.aifactory.techshare.entity.Blog::getCategoryId, id)
        );
        if (blogCount > 0) {
            throw new BusinessException(400, "该分类下存在博客，无法删除");
        }

        categoryMapper.deleteById(id);
        log.info("删除分类成功: {}", category.getName());
    }

    /**
     * 转换为响应DTO
     */
    private CategoryResponse convertToResponse(BlogCategory category) {
        // 统计该分类下的博客数量
        Long blogCount = blogMapper.selectCount(
                new LambdaQueryWrapper<com.aifactory.techshare.entity.Blog>()
                        .eq(com.aifactory.techshare.entity.Blog::getCategoryId, category.getId())
        );

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .sortOrder(category.getSortOrder())
                .blogCount(blogCount.intValue())
                .build();
    }

}
