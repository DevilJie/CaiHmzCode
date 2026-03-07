package com.aifactory.techshare.service;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.dto.BlogCreateRequest;
import com.aifactory.techshare.dto.BlogDetailResponse;
import com.aifactory.techshare.dto.BlogResponse;
import com.aifactory.techshare.dto.BlogUpdateRequest;
import com.aifactory.techshare.dto.TagResponse;
import com.aifactory.techshare.entity.Blog;
import com.aifactory.techshare.entity.BlogCategory;
import com.aifactory.techshare.entity.BlogTag;
import com.aifactory.techshare.entity.BlogTagRelation;
import com.aifactory.techshare.exception.BusinessException;
import com.aifactory.techshare.mapper.BlogCategoryMapper;
import com.aifactory.techshare.mapper.BlogMapper;
import com.aifactory.techshare.mapper.BlogTagMapper;
import com.aifactory.techshare.mapper.BlogTagRelationMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 博客服务
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogMapper blogMapper;
    private final BlogCategoryMapper categoryMapper;
    private final BlogTagRelationMapper tagRelationMapper;
    private final BlogTagMapper tagMapper;
    private final BlogTagService tagService;

    /**
     * 获取已发布博客列表（用户端）
     *
     * @param pageNum    页码
     * @param pageSize   每页数量
     * @param categoryId 分类ID（可选）
     * @param tagId      标签ID（可选）
     * @param keyword    关键词（可选）
     * @return 分页结果
     */
    public PageResult<BlogResponse> getPublishedBlogList(int pageNum, int pageSize,
                                                          Long categoryId, Long tagId, String keyword) {
        // 构建查询条件
        LambdaQueryWrapper<Blog> queryWrapper = new LambdaQueryWrapper<Blog>()
                .eq(Blog::getStatus, 1) // 只查询已发布的博客
                .orderByDesc(Blog::getPublishTime);

        // 分类筛选
        if (categoryId != null) {
            queryWrapper.eq(Blog::getCategoryId, categoryId);
        }

        // 关键词搜索
        if (StringUtils.hasText(keyword)) {
            queryWrapper.and(w -> w
                    .like(Blog::getTitle, keyword)
                    .or()
                    .like(Blog::getSummary, keyword)
            );
        }

        // 标签筛选
        if (tagId != null) {
            // 先查询关联表中该标签关联的博客ID
            List<BlogTagRelation> relations = tagRelationMapper.selectList(
                    new LambdaQueryWrapper<BlogTagRelation>()
                            .eq(BlogTagRelation::getTagId, tagId)
            );
            if (relations.isEmpty()) {
                return PageResult.empty(pageNum, pageSize);
            }
            List<Long> blogIds = relations.stream()
                    .map(BlogTagRelation::getBlogId)
                    .collect(Collectors.toList());
            queryWrapper.in(Blog::getId, blogIds);
        }

        // 分页查询
        Page<Blog> page = new Page<>(pageNum, pageSize);
        Page<Blog> blogPage = blogMapper.selectPage(page, queryWrapper);

        // 转换为响应DTO
        List<BlogResponse> blogResponses = blogPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PageResult<>(blogResponses, blogPage.getTotal(), pageNum, pageSize);
    }

    /**
     * 获取博客详情（用户端）
     *
     * @param id 博客ID
     * @return 博客详情
     */
    public BlogDetailResponse getBlogDetail(Long id) {
        Blog blog = blogMapper.selectById(id);
        if (blog == null) {
            throw new BusinessException(404, "博客不存在");
        }

        // 用户端只能查看已发布的博客
        if (blog.getStatus() != 1) {
            throw new BusinessException(404, "博客不存在");
        }

        return convertToDetailResponse(blog);
    }

    /**
     * 增加浏览次数
     *
     * @param id 博客ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void incrementViewCount(Long id) {
        blogMapper.update(null, new LambdaUpdateWrapper<Blog>()
                .eq(Blog::getId, id)
                .setSql("view_count = view_count + 1")
        );
    }

    /**
     * 分页获取博客列表（管理端，包含草稿）
     *
     * @param pageNum    页码
     * @param pageSize   每页数量
     * @param status     状态（可选）
     * @param categoryId 分类ID（可选）
     * @param keyword    关键词（可选）
     * @return 分页结果
     */
    public PageResult<BlogResponse> getBlogListForAdmin(int pageNum, int pageSize,
                                                         Integer status, Long categoryId, String keyword) {
        // 构建查询条件
        LambdaQueryWrapper<Blog> queryWrapper = new LambdaQueryWrapper<Blog>()
                .orderByDesc(Blog::getCreateTime);

        // 状态筛选
        if (status != null) {
            queryWrapper.eq(Blog::getStatus, status);
        }

        // 分类筛选
        if (categoryId != null) {
            queryWrapper.eq(Blog::getCategoryId, categoryId);
        }

        // 关键词搜索
        if (StringUtils.hasText(keyword)) {
            queryWrapper.and(w -> w
                    .like(Blog::getTitle, keyword)
                    .or()
                    .like(Blog::getSummary, keyword)
            );
        }

        // 分页查询
        Page<Blog> page = new Page<>(pageNum, pageSize);
        Page<Blog> blogPage = blogMapper.selectPage(page, queryWrapper);

        // 转换为响应DTO
        List<BlogResponse> blogResponses = blogPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PageResult<>(blogResponses, blogPage.getTotal(), pageNum, pageSize);
    }

    /**
     * 获取博客详情（管理端）
     *
     * @param id 博客ID
     * @return 博客详情
     */
    public BlogDetailResponse getBlogDetailForAdmin(Long id) {
        Blog blog = blogMapper.selectById(id);
        if (blog == null) {
            throw new BusinessException(404, "博客不存在");
        }
        return convertToDetailResponse(blog);
    }

    /**
     * 创建博客
     *
     * @param request 创建请求
     * @return 博客详情
     */
    @Transactional(rollbackFor = Exception.class)
    public BlogDetailResponse createBlog(BlogCreateRequest request) {
        // 验证分类是否存在
        if (request.getCategoryId() != null) {
            BlogCategory category = categoryMapper.selectById(request.getCategoryId());
            if (category == null) {
                throw new BusinessException(400, "分类不存在");
            }
        }

        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setSummary(request.getSummary());
        blog.setContent(request.getContent());
        blog.setCategoryId(request.getCategoryId());
        blog.setCoverImage(request.getCoverImage());
        blog.setVideoUrl(request.getVideoUrl());
        blog.setStatus(0); // 默认草稿状态
        blog.setViewCount(0);

        blogMapper.insert(blog);
        log.info("创建博客成功: {}", blog.getTitle());

        // 处理标签关联
        if (!CollectionUtils.isEmpty(request.getTagIds())) {
            saveTagRelations(blog.getId(), request.getTagIds());
        }

        return convertToDetailResponse(blog);
    }

    /**
     * 更新博客
     *
     * @param id      博客ID
     * @param request 更新请求
     * @return 博客详情
     */
    @Transactional(rollbackFor = Exception.class)
    public BlogDetailResponse updateBlog(Long id, BlogUpdateRequest request) {
        Blog blog = blogMapper.selectById(id);
        if (blog == null) {
            throw new BusinessException(404, "博客不存在");
        }

        // 验证分类是否存在
        if (request.getCategoryId() != null) {
            BlogCategory category = categoryMapper.selectById(request.getCategoryId());
            if (category == null) {
                throw new BusinessException(400, "分类不存在");
            }
        }

        // 更新博客信息
        if (StringUtils.hasText(request.getTitle())) {
            blog.setTitle(request.getTitle());
        }
        if (request.getSummary() != null) {
            blog.setSummary(request.getSummary());
        }
        if (StringUtils.hasText(request.getContent())) {
            blog.setContent(request.getContent());
        }
        if (request.getCategoryId() != null) {
            blog.setCategoryId(request.getCategoryId());
        }
        if (request.getCoverImage() != null) {
            blog.setCoverImage(request.getCoverImage());
        }
        if (request.getVideoUrl() != null) {
            blog.setVideoUrl(request.getVideoUrl());
        }

        blogMapper.updateById(blog);
        log.info("更新博客成功: {}", blog.getTitle());

        // 更新标签关联
        if (request.getTagIds() != null) {
            // 先删除旧的关联关系
            tagRelationMapper.delete(
                    new LambdaQueryWrapper<BlogTagRelation>()
                            .eq(BlogTagRelation::getBlogId, id)
            );
            // 添加新的关联关系
            if (!CollectionUtils.isEmpty(request.getTagIds())) {
                saveTagRelations(id, request.getTagIds());
            }
        }

        return convertToDetailResponse(blog);
    }

    /**
     * 发布博客
     *
     * @param id 博客ID
     * @return 博客详情
     */
    @Transactional(rollbackFor = Exception.class)
    public BlogDetailResponse publishBlog(Long id) {
        Blog blog = blogMapper.selectById(id);
        if (blog == null) {
            throw new BusinessException(404, "博客不存在");
        }

        if (blog.getStatus() == 1) {
            throw new BusinessException(400, "博客已发布");
        }

        blog.setStatus(1);
        blog.setPublishTime(LocalDateTime.now());

        blogMapper.updateById(blog);
        log.info("发布博客成功: {}", blog.getTitle());

        return convertToDetailResponse(blog);
    }

    /**
     * 取消发布博客
     *
     * @param id 博客ID
     * @return 博客详情
     */
    @Transactional(rollbackFor = Exception.class)
    public BlogDetailResponse unpublishBlog(Long id) {
        Blog blog = blogMapper.selectById(id);
        if (blog == null) {
            throw new BusinessException(404, "博客不存在");
        }

        if (blog.getStatus() == 0) {
            throw new BusinessException(400, "博客未发布");
        }

        blog.setStatus(0);

        blogMapper.updateById(blog);
        log.info("取消发布博客成功: {}", blog.getTitle());

        return convertToDetailResponse(blog);
    }

    /**
     * 删除博客
     *
     * @param id 博客ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteBlog(Long id) {
        Blog blog = blogMapper.selectById(id);
        if (blog == null) {
            throw new BusinessException(404, "博客不存在");
        }

        // 删除标签关联关系
        tagRelationMapper.delete(
                new LambdaQueryWrapper<BlogTagRelation>()
                        .eq(BlogTagRelation::getBlogId, id)
        );

        // 删除博客
        blogMapper.deleteById(id);
        log.info("删除博客成功: {}", blog.getTitle());
    }

    /**
     * 保存标签关联关系
     */
    private void saveTagRelations(Long blogId, List<Long> tagIds) {
        for (Long tagId : tagIds) {
            // 验证标签是否存在
            BlogTag tag = tagMapper.selectById(tagId);
            if (tag == null) {
                log.warn("标签不存在，跳过: tagId={}", tagId);
                continue;
            }
            BlogTagRelation relation = new BlogTagRelation();
            relation.setBlogId(blogId);
            relation.setTagId(tagId);
            tagRelationMapper.insert(relation);
        }
    }

    /**
     * 转换为列表响应DTO
     */
    private BlogResponse convertToResponse(Blog blog) {
        // 获取分类名称
        String categoryName = null;
        if (blog.getCategoryId() != null) {
            BlogCategory category = categoryMapper.selectById(blog.getCategoryId());
            if (category != null) {
                categoryName = category.getName();
            }
        }

        // 获取标签列表
        List<TagResponse> tags = tagService.getTagsByBlogId(blog.getId());

        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .summary(blog.getSummary())
                .categoryId(blog.getCategoryId())
                .categoryName(categoryName)
                .coverImage(blog.getCoverImage())
                .videoUrl(blog.getVideoUrl())
                .status(blog.getStatus())
                .publishTime(blog.getPublishTime())
                .viewCount(blog.getViewCount())
                .createTime(blog.getCreateTime())
                .tags(tags)
                .build();
    }

    /**
     * 转换为详情响应DTO
     */
    private BlogDetailResponse convertToDetailResponse(Blog blog) {
        // 获取分类名称
        String categoryName = null;
        if (blog.getCategoryId() != null) {
            BlogCategory category = categoryMapper.selectById(blog.getCategoryId());
            if (category != null) {
                categoryName = category.getName();
            }
        }

        // 获取标签列表
        List<TagResponse> tags = tagService.getTagsByBlogId(blog.getId());

        return BlogDetailResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .summary(blog.getSummary())
                .content(blog.getContent())
                .categoryId(blog.getCategoryId())
                .categoryName(categoryName)
                .coverImage(blog.getCoverImage())
                .videoUrl(blog.getVideoUrl())
                .status(blog.getStatus())
                .publishTime(blog.getPublishTime())
                .viewCount(blog.getViewCount())
                .createTime(blog.getCreateTime())
                .updateTime(blog.getUpdateTime())
                .tags(tags)
                .build();
    }

}
