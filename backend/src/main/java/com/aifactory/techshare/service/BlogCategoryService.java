package com.aifactory.techshare.service;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.dto.CategoryRequest;
import com.aifactory.techshare.dto.CategoryResponse;
import com.aifactory.techshare.dto.CategoryTreeResponse;
import com.aifactory.techshare.entity.Blog;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    public PageResult<CategoryResponse> getCategoryPage(int pageNum, int pageSize) {
        Page<BlogCategory> page = new Page<>(pageNum, pageSize);
        Page<BlogCategory> categoryPage = categoryMapper.selectPage(page,
                new LambdaQueryWrapper<BlogCategory>()
                        .orderByAsc(BlogCategory::getSortOrder)
                        .orderByDesc(BlogCategory::getCreateTime)
        );

        List<CategoryResponse> list = categoryPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PageResult<>(list, categoryPage.getTotal(), pageNum, pageSize);
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
     * 获取完整的分类树
     *
     * @return 分类树列表
     */
    public List<CategoryTreeResponse> getCategoryTree() {
        // 获取所有分类
        List<BlogCategory> allCategories = categoryMapper.selectList(
                new LambdaQueryWrapper<BlogCategory>()
                        .orderByAsc(BlogCategory::getLevel)
                        .orderByAsc(BlogCategory::getSortOrder)
        );

        // 转换为树形响应DTO
        List<CategoryTreeResponse> treeNodes = allCategories.stream()
                .map(this::convertToTreeResponse)
                .collect(Collectors.toList());

        // 构建树结构
        return buildTree(treeNodes);
    }

    /**
     * 获取所有末级分类（用于文章关联）
     * 末级分类是指没有子分类的分类
     *
     * @return 末级分类列表
     */
    public List<CategoryResponse> getLeafCategories() {
        // 获取所有分类
        List<BlogCategory> allCategories = categoryMapper.selectList(null);

        // 找出所有父分类ID
        List<Long> parentIds = allCategories.stream()
                .map(BlogCategory::getParentId)
                .filter(id -> id != null)
                .collect(Collectors.toList());

        // 筛选出末级分类（不是任何分类的父分类）
        List<BlogCategory> leafCategories = allCategories.stream()
                .filter(category -> !parentIds.contains(category.getId()))
                .collect(Collectors.toList());

        return leafCategories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 构建树结构
     * 将扁平的分类列表转换为树形结构
     *
     * @param allNodes 所有分类节点
     * @return 树形结构列表（只包含顶级节点）
     */
    private List<CategoryTreeResponse> buildTree(List<CategoryTreeResponse> allNodes) {
        if (allNodes == null || allNodes.isEmpty()) {
            return new ArrayList<>();
        }

        // 按parentId分组
        Map<Long, List<CategoryTreeResponse>> parentMap = allNodes.stream()
                .filter(node -> node.getParentId() != null)
                .collect(Collectors.groupingBy(CategoryTreeResponse::getParentId));

        // 设置子节点和isLeaf属性
        for (CategoryTreeResponse node : allNodes) {
            List<CategoryTreeResponse> children = parentMap.get(node.getId());
            if (children != null && !children.isEmpty()) {
                node.setChildren(children);
                node.setIsLeaf(false);
            } else {
                node.setChildren(new ArrayList<>());
                node.setIsLeaf(true);
            }
        }

        // 返回顶级节点（parentId为null）
        return allNodes.stream()
                .filter(node -> node.getParentId() == null)
                .collect(Collectors.toList());
    }

    /**
     * 创建分类
     * 自动计算level值
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

        // 计算level
        int level = 0;
        if (request.getParentId() != null) {
            BlogCategory parentCategory = categoryMapper.selectById(request.getParentId());
            if (parentCategory == null) {
                throw new BusinessException(400, "父分类不存在");
            }
            level = parentCategory.getLevel() + 1;
        }

        BlogCategory category = new BlogCategory();
        category.setName(request.getName());
        category.setParentId(request.getParentId());
        category.setLevel(level);
        category.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
        category.setCreateTime(LocalDateTime.now());
        category.setUpdateTime(LocalDateTime.now());

        categoryMapper.insert(category);
        log.info("创建分类成功: {}, level: {}", category.getName(), level);

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

        // 如果修改了父分类，需要重新计算level
        if (request.getParentId() != null && !request.getParentId().equals(category.getParentId())) {
            // 不能将自己设置为父分类
            if (request.getParentId().equals(id)) {
                throw new BusinessException(400, "不能将自己设置为父分类");
            }

            // 检查父分类是否存在
            BlogCategory parentCategory = categoryMapper.selectById(request.getParentId());
            if (parentCategory == null) {
                throw new BusinessException(400, "父分类不存在");
            }

            // 检查是否会形成循环（父分类不能是自己的子孙）
            if (isDescendant(request.getParentId(), id)) {
                throw new BusinessException(400, "不能将子分类设置为父分类");
            }

            category.setLevel(parentCategory.getLevel() + 1);
            category.setParentId(request.getParentId());
        }

        category.setName(request.getName());
        if (request.getSortOrder() != null) {
            category.setSortOrder(request.getSortOrder());
        }
        category.setUpdateTime(LocalDateTime.now());

        categoryMapper.updateById(category);
        log.info("更新分类成功: {}", category.getName());

        return convertToResponse(category);
    }

    /**
     * 检查目标分类是否是指定分类的子孙
     *
     * @param targetId   目标分类ID
     * @param ancestorId 祖先分类ID
     * @return 如果是子孙返回true
     */
    private boolean isDescendant(Long targetId, Long ancestorId) {
        BlogCategory target = categoryMapper.selectById(targetId);
        if (target == null || target.getParentId() == null) {
            return false;
        }
        if (target.getParentId().equals(ancestorId)) {
            return true;
        }
        return isDescendant(target.getParentId(), ancestorId);
    }

    /**
     * 删除分类
     * 检查是否有子分类，有则不允许删除
     *
     * @param id 分类ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteCategory(Long id) {
        BlogCategory category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(404, "分类不存在");
        }

        // 检查是否有子分类
        Long childCount = categoryMapper.selectCount(
                new LambdaQueryWrapper<BlogCategory>()
                        .eq(BlogCategory::getParentId, id)
        );
        if (childCount > 0) {
            throw new BusinessException(400, "该分类下存在子分类，无法删除");
        }

        // 检查该分类下是否有博客
        Long blogCount = blogMapper.selectCount(
                new LambdaQueryWrapper<Blog>()
                        .eq(Blog::getCategoryId, id)
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
                new LambdaQueryWrapper<Blog>()
                        .eq(Blog::getCategoryId, category.getId())
        );

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .sortOrder(category.getSortOrder())
                .blogCount(blogCount.intValue())
                .build();
    }

    /**
     * 转换为树形响应DTO
     */
    private CategoryTreeResponse convertToTreeResponse(BlogCategory category) {
        // 统计该分类下的博客数量
        Long blogCount = blogMapper.selectCount(
                new LambdaQueryWrapper<Blog>()
                        .eq(Blog::getCategoryId, category.getId())
        );

        return CategoryTreeResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .parentId(category.getParentId())
                .level(category.getLevel())
                .sortOrder(category.getSortOrder())
                .blogCount(blogCount.intValue())
                .isLeaf(true) // 默认设为true，在buildTree中会更新
                .children(new ArrayList<>())
                .build();
    }

}
