package com.aifactory.techshare.service;

import com.aifactory.techshare.dto.DonationQrcodeRequest;
import com.aifactory.techshare.dto.DonationQrcodeResponse;
import com.aifactory.techshare.entity.DonationQrcode;
import com.aifactory.techshare.exception.BusinessException;
import com.aifactory.techshare.mapper.DonationQrcodeMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 收款码服务
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DonationQrcodeService {

    private final DonationQrcodeMapper donationQrcodeMapper;

    /**
     * 获取展示的收款码列表（用户端）
     *
     * @return 收款码列表
     */
    public List<DonationQrcodeResponse> getShowQrcodeList() {
        List<DonationQrcode> qrcodes = donationQrcodeMapper.selectList(
                new LambdaQueryWrapper<DonationQrcode>()
                        .eq(DonationQrcode::getIsShow, 1)
                        .orderByAsc(DonationQrcode::getSortOrder)
        );

        return qrcodes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 获取所有收款码列表（管理端）
     *
     * @return 收款码列表
     */
    public List<DonationQrcodeResponse> getAllQrcodeList() {
        List<DonationQrcode> qrcodes = donationQrcodeMapper.selectList(
                new LambdaQueryWrapper<DonationQrcode>()
                        .orderByAsc(DonationQrcode::getSortOrder)
        );

        return qrcodes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 获取收款码详情
     *
     * @param id 收款码ID
     * @return 收款码详情
     */
    public DonationQrcodeResponse getQrcodeDetail(Long id) {
        DonationQrcode qrcode = donationQrcodeMapper.selectById(id);
        if (qrcode == null) {
            throw new BusinessException(404, "收款码不存在");
        }
        return convertToResponse(qrcode);
    }

    /**
     * 创建收款码
     *
     * @param request 创建请求
     * @return 收款码详情
     */
    @Transactional(rollbackFor = Exception.class)
    public DonationQrcodeResponse createQrcode(DonationQrcodeRequest request) {
        // 验证类型
        if (!isValidType(request.getType())) {
            throw new BusinessException(400, "收款码类型无效，只支持WECHAT或ALIPAY");
        }

        DonationQrcode qrcode = new DonationQrcode();
        qrcode.setType(request.getType());
        // 如果name为空，则根据type设置默认名称
        qrcode.setName(request.getName() != null ? request.getName() :
                ("WECHAT".equals(request.getType()) ? "微信支付" : "支付宝"));
        qrcode.setQrcodeUrl(request.getQrcodeUrl());
        qrcode.setIsShow(request.getIsShow() != null ? request.getIsShow() : 1);
        qrcode.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);

        donationQrcodeMapper.insert(qrcode);
        log.info("创建收款码成功: id={}, type={}", qrcode.getId(), qrcode.getType());

        return convertToResponse(qrcode);
    }

    /**
     * 更新收款码
     *
     * @param id      收款码ID
     * @param request 更新请求
     * @return 收款码详情
     */
    @Transactional(rollbackFor = Exception.class)
    public DonationQrcodeResponse updateQrcode(Long id, DonationQrcodeRequest request) {
        DonationQrcode qrcode = donationQrcodeMapper.selectById(id);
        if (qrcode == null) {
            throw new BusinessException(404, "收款码不存在");
        }

        // 验证类型
        if (request.getType() != null && !isValidType(request.getType())) {
            throw new BusinessException(400, "收款码类型无效，只支持WECHAT或ALIPAY");
        }

        // 更新字段
        if (request.getType() != null) {
            qrcode.setType(request.getType());
        }
        if (request.getName() != null) {
            qrcode.setName(request.getName());
        }
        if (request.getQrcodeUrl() != null) {
            qrcode.setQrcodeUrl(request.getQrcodeUrl());
        }
        if (request.getIsShow() != null) {
            qrcode.setIsShow(request.getIsShow());
        }
        if (request.getSortOrder() != null) {
            qrcode.setSortOrder(request.getSortOrder());
        }

        donationQrcodeMapper.updateById(qrcode);
        log.info("更新收款码成功: id={}", id);

        return convertToResponse(qrcode);
    }

    /**
     * 删除收款码
     *
     * @param id 收款码ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteQrcode(Long id) {
        DonationQrcode qrcode = donationQrcodeMapper.selectById(id);
        if (qrcode == null) {
            throw new BusinessException(404, "收款码不存在");
        }

        donationQrcodeMapper.deleteById(id);
        log.info("删除收款码成功: id={}", id);
    }

    /**
     * 切换展示状态
     *
     * @param id 收款码ID
     * @return 收款码详情
     */
    @Transactional(rollbackFor = Exception.class)
    public DonationQrcodeResponse toggleShow(Long id) {
        DonationQrcode qrcode = donationQrcodeMapper.selectById(id);
        if (qrcode == null) {
            throw new BusinessException(404, "收款码不存在");
        }

        qrcode.setIsShow(qrcode.getIsShow() == 1 ? 0 : 1);
        donationQrcodeMapper.updateById(qrcode);
        log.info("切换收款码展示状态: id={}, isShow={}", id, qrcode.getIsShow());

        return convertToResponse(qrcode);
    }

    /**
     * 验证收款码类型
     */
    private boolean isValidType(String type) {
        return "WECHAT".equals(type) || "ALIPAY".equals(type);
    }

    /**
     * 转换为响应DTO
     */
    private DonationQrcodeResponse convertToResponse(DonationQrcode qrcode) {
        return DonationQrcodeResponse.builder()
                .id(qrcode.getId())
                .type(qrcode.getType())
                .name(qrcode.getName())
                .qrcodeUrl(qrcode.getQrcodeUrl())
                .isShow(qrcode.getIsShow())
                .sortOrder(qrcode.getSortOrder())
                .createTime(qrcode.getCreateTime())
                .updateTime(qrcode.getUpdateTime())
                .build();
    }

}
