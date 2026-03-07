package com.aifactory.techshare.service;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.dto.AdvertisementRequest;
import com.aifactory.techshare.dto.AdvertisementResponse;
import com.aifactory.techshare.entity.Advertisement;
import com.aifactory.techshare.exception.BusinessException;
import com.aifactory.techshare.mapper.AdvertisementMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 广告服务
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdvertisementService {

    private final AdvertisementMapper advertisementMapper;

    /**
     * 获取启用的广告列表（用户端）
     * 按位置查询，过滤时间范围，按权重排序
     *
     * @param position 广告位类型（BANNER/POPUP）
     * @return 广告列表
     */
    public List<AdvertisementResponse> getActiveAdvertisements(String position) {
        LocalDateTime now = LocalDateTime.now();

        // 构建查询条件
        LambdaQueryWrapper<Advertisement> queryWrapper = new LambdaQueryWrapper<Advertisement>()
                .eq(Advertisement::getStatus, 1) // 只查询启用的广告
                .eq(StringUtils.hasText(position), Advertisement::getPosition, position) // 按位置筛选
                .orderByDesc(Advertisement::getWeight); // 按权重降序

        // 过滤时间范围
        queryWrapper.and(w -> w
                .isNull(Advertisement::getStartTime)
                .or()
                .le(Advertisement::getStartTime, now)
        );
        queryWrapper.and(w -> w
                .isNull(Advertisement::getEndTime)
                .or()
                .ge(Advertisement::getEndTime, now)
        );

        List<Advertisement> advertisements = advertisementMapper.selectList(queryWrapper);

        return advertisements.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 分页获取广告列表（管理端）
     *
     * @param pageNum  页码
     * @param pageSize 每页数量
     * @param position 广告位类型（可选）
     * @param status   状态（可选）
     * @param keyword  关键词（可选）
     * @return 分页结果
     */
    public PageResult<AdvertisementResponse> getAdvertisementListForAdmin(int pageNum, int pageSize,
                                                                           String position, Integer status, String keyword) {
        // 构建查询条件
        LambdaQueryWrapper<Advertisement> queryWrapper = new LambdaQueryWrapper<Advertisement>()
                .orderByDesc(Advertisement::getCreateTime);

        // 广告位类型筛选
        if (StringUtils.hasText(position)) {
            queryWrapper.eq(Advertisement::getPosition, position);
        }

        // 状态筛选
        if (status != null) {
            queryWrapper.eq(Advertisement::getStatus, status);
        }

        // 关键词搜索
        if (StringUtils.hasText(keyword)) {
            queryWrapper.like(Advertisement::getName, keyword);
        }

        // 分页查询
        Page<Advertisement> page = new Page<>(pageNum, pageSize);
        Page<Advertisement> adPage = advertisementMapper.selectPage(page, queryWrapper);

        // 转换为响应DTO
        List<AdvertisementResponse> adResponses = adPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PageResult<>(adResponses, adPage.getTotal(), pageNum, pageSize);
    }

    /**
     * 获取广告详情
     *
     * @param id 广告ID
     * @return 广告详情
     */
    public AdvertisementResponse getAdvertisementDetail(Long id) {
        Advertisement advertisement = advertisementMapper.selectById(id);
        if (advertisement == null) {
            throw new BusinessException(404, "广告不存在");
        }
        return convertToResponse(advertisement);
    }

    /**
     * 创建广告
     *
     * @param request 创建请求
     * @return 广告详情
     */
    @Transactional(rollbackFor = Exception.class)
    public AdvertisementResponse createAdvertisement(AdvertisementRequest request) {
        // 验证广告位类型
        if (!isValidPosition(request.getPosition())) {
            throw new BusinessException(400, "无效的广告位类型");
        }

        Advertisement advertisement = new Advertisement();
        advertisement.setPosition(request.getPosition());
        advertisement.setName(request.getName());
        advertisement.setImageUrl(request.getImageUrl());
        advertisement.setLinkUrl(request.getLinkUrl());
        advertisement.setWeight(request.getWeight());
        advertisement.setStartTime(request.getStartTime());
        advertisement.setEndTime(request.getEndTime());
        advertisement.setStatus(request.getStatus() != null ? request.getStatus() : 1);

        advertisementMapper.insert(advertisement);
        log.info("创建广告成功: {}", advertisement.getName());

        return convertToResponse(advertisement);
    }

    /**
     * 更新广告
     *
     * @param id      广告ID
     * @param request 更新请求
     * @return 广告详情
     */
    @Transactional(rollbackFor = Exception.class)
    public AdvertisementResponse updateAdvertisement(Long id, AdvertisementRequest request) {
        Advertisement advertisement = advertisementMapper.selectById(id);
        if (advertisement == null) {
            throw new BusinessException(404, "广告不存在");
        }

        // 验证广告位类型
        if (StringUtils.hasText(request.getPosition()) && !isValidPosition(request.getPosition())) {
            throw new BusinessException(400, "无效的广告位类型");
        }

        // 更新广告信息
        if (StringUtils.hasText(request.getPosition())) {
            advertisement.setPosition(request.getPosition());
        }
        if (StringUtils.hasText(request.getName())) {
            advertisement.setName(request.getName());
        }
        if (StringUtils.hasText(request.getImageUrl())) {
            advertisement.setImageUrl(request.getImageUrl());
        }
        if (request.getLinkUrl() != null) {
            advertisement.setLinkUrl(request.getLinkUrl());
        }
        if (request.getWeight() != null) {
            advertisement.setWeight(request.getWeight());
        }
        if (request.getStartTime() != null) {
            advertisement.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            advertisement.setEndTime(request.getEndTime());
        }
        if (request.getStatus() != null) {
            advertisement.setStatus(request.getStatus());
        }

        advertisementMapper.updateById(advertisement);
        log.info("更新广告成功: {}", advertisement.getName());

        return convertToResponse(advertisement);
    }

    /**
     * 启用广告
     *
     * @param id 广告ID
     * @return 广告详情
     */
    @Transactional(rollbackFor = Exception.class)
    public AdvertisementResponse enableAdvertisement(Long id) {
        Advertisement advertisement = advertisementMapper.selectById(id);
        if (advertisement == null) {
            throw new BusinessException(404, "广告不存在");
        }

        advertisement.setStatus(1);
        advertisementMapper.updateById(advertisement);
        log.info("启用广告成功: {}", advertisement.getName());

        return convertToResponse(advertisement);
    }

    /**
     * 禁用广告
     *
     * @param id 广告ID
     * @return 广告详情
     */
    @Transactional(rollbackFor = Exception.class)
    public AdvertisementResponse disableAdvertisement(Long id) {
        Advertisement advertisement = advertisementMapper.selectById(id);
        if (advertisement == null) {
            throw new BusinessException(404, "广告不存在");
        }

        advertisement.setStatus(0);
        advertisementMapper.updateById(advertisement);
        log.info("禁用广告成功: {}", advertisement.getName());

        return convertToResponse(advertisement);
    }

    /**
     * 删除广告
     *
     * @param id 广告ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteAdvertisement(Long id) {
        Advertisement advertisement = advertisementMapper.selectById(id);
        if (advertisement == null) {
            throw new BusinessException(404, "广告不存在");
        }

        advertisementMapper.deleteById(id);
        log.info("删除广告成功: {}", advertisement.getName());
    }

    /**
     * 验证广告位类型是否有效
     */
    private boolean isValidPosition(String position) {
        return "BANNER".equals(position) || "POPUP".equals(position);
    }

    /**
     * 转换为响应DTO
     */
    private AdvertisementResponse convertToResponse(Advertisement advertisement) {
        return AdvertisementResponse.builder()
                .id(advertisement.getId())
                .position(advertisement.getPosition())
                .name(advertisement.getName())
                .imageUrl(advertisement.getImageUrl())
                .linkUrl(advertisement.getLinkUrl())
                .weight(advertisement.getWeight())
                .startTime(advertisement.getStartTime())
                .endTime(advertisement.getEndTime())
                .status(advertisement.getStatus())
                .createTime(advertisement.getCreateTime())
                .updateTime(advertisement.getUpdateTime())
                .build();
    }

}
