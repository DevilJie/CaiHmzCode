package com.aifactory.techshare.service;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.dto.TagRequest;
import com.aifactory.techshare.dto.TagResponse;
import com.aifactory.techshare.entity.BlogTag;
import com.aifactory.techshare.entity.BlogTagRelation;
import com.aifactory.techshare.exception.BusinessException;
import com.aifactory.techshare.mapper.BlogTagMapper;
import com.aifactory.techshare.mapper.BlogTagRelationMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 博客标签服务
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BlogTagService {

    private final BlogTagMapper tagMapper;
    private final BlogTagRelationMapper tagRelationMapper;

    /**
     * 获取所有标签列表（用户端）
     *
     * @return 标签列表
     */
    public List<TagResponse> getAllTags() {
        List<BlogTag> tags = tagMapper.selectList(
                new LambdaQueryWrapper<BlogTag>()
                        .orderByDesc(BlogTag::getCreateTime)
        );

        return tags.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 分页获取标签列表（管理端）
     *
     * @param pageNum  页码
     * @param pageSize 每页数量
     * @return 分页结果
     */
    public PageResult<TagResponse> getTagPage(int pageNum, int pageSize) {
        Page<BlogTag> page = new Page<>(pageNum, pageSize);
        Page<BlogTag> tagPage = tagMapper.selectPage(page,
                new LambdaQueryWrapper<BlogTag>()
                        .orderByDesc(BlogTag::getCreateTime)
        );

        List<TagResponse> list = tagPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PageResult<>(list, tagPage.getTotal(), pageNum, pageSize);
    }

    /**
     * 根据ID获取标签
     *
     * @param id 标签ID
     * @return 标签详情
     */
    public TagResponse getTagById(Long id) {
        BlogTag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new BusinessException(404, "标签不存在");
        }
        return convertToResponse(tag);
    }

    /**
     * 创建标签
     *
     * @param request 标签请求
     * @return 创建后的标签
     */
    @Transactional(rollbackFor = Exception.class)
    public TagResponse createTag(TagRequest request) {
        // 检查标签名称是否已存在
        Long count = tagMapper.selectCount(
                new LambdaQueryWrapper<BlogTag>()
                        .eq(BlogTag::getName, request.getName())
        );
        if (count > 0) {
            throw new BusinessException(400, "标签名称已存在");
        }

        BlogTag tag = new BlogTag();
        tag.setName(request.getName());

        tagMapper.insert(tag);
        log.info("创建标签成功: {}", tag.getName());

        return convertToResponse(tag);
    }

    /**
     * 更新标签
     *
     * @param id      标签ID
     * @param request 标签请求
     * @return 更新后的标签
     */
    @Transactional(rollbackFor = Exception.class)
    public TagResponse updateTag(Long id, TagRequest request) {
        BlogTag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new BusinessException(404, "标签不存在");
        }

        // 检查标签名称是否与其他标签重复
        Long count = tagMapper.selectCount(
                new LambdaQueryWrapper<BlogTag>()
                        .eq(BlogTag::getName, request.getName())
                        .ne(BlogTag::getId, id)
        );
        if (count > 0) {
            throw new BusinessException(400, "标签名称已存在");
        }

        tag.setName(request.getName());
        tagMapper.updateById(tag);
        log.info("更新标签成功: {}", tag.getName());

        return convertToResponse(tag);
    }

    /**
     * 删除标签
     *
     * @param id 标签ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteTag(Long id) {
        BlogTag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new BusinessException(404, "标签不存在");
        }

        // 删除标签关联关系
        tagRelationMapper.delete(
                new LambdaQueryWrapper<BlogTagRelation>()
                        .eq(BlogTagRelation::getTagId, id)
        );

        // 删除标签
        tagMapper.deleteById(id);
        log.info("删除标签成功: {}", tag.getName());
    }

    /**
     * 根据博客ID获取标签列表
     *
     * @param blogId 博客ID
     * @return 标签列表
     */
    public List<TagResponse> getTagsByBlogId(Long blogId) {
        // 获取博客关联的标签ID列表
        List<BlogTagRelation> relations = tagRelationMapper.selectList(
                new LambdaQueryWrapper<BlogTagRelation>()
                        .eq(BlogTagRelation::getBlogId, blogId)
        );

        if (relations.isEmpty()) {
            return List.of();
        }

        // 获取标签详情
        List<Long> tagIds = relations.stream()
                .map(BlogTagRelation::getTagId)
                .collect(Collectors.toList());

        List<BlogTag> tags = tagMapper.selectBatchIds(tagIds);
        return tags.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 转换为响应DTO
     */
    private TagResponse convertToResponse(BlogTag tag) {
        // 统计该标签关联的博客数量
        Long blogCount = tagRelationMapper.selectCount(
                new LambdaQueryWrapper<BlogTagRelation>()
                        .eq(BlogTagRelation::getTagId, tag.getId())
        );

        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .blogCount(blogCount.intValue())
                .build();
    }

}
