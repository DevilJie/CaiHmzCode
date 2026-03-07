package com.aifactory.techshare.service;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.dto.UserCreateRequest;
import com.aifactory.techshare.dto.UserResponse;
import com.aifactory.techshare.dto.UserUpdateRequest;
import com.aifactory.techshare.entity.User;
import com.aifactory.techshare.exception.BusinessException;
import com.aifactory.techshare.mapper.UserMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户管理服务（管理端）
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * 获取用户列表（分页）
     *
     * @param pageNum  页码
     * @param pageSize 每页数量
     * @param keyword  搜索关键词
     * @param role     角色筛选
     * @param status   状态筛选
     * @return 分页结果
     */
    public PageResult<UserResponse> getUserList(int pageNum, int pageSize, String keyword, String role, Integer status) {
        // 构建查询条件
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<User>()
                .orderByDesc(User::getCreateTime);

        // 关键词搜索
        if (StringUtils.hasText(keyword)) {
            queryWrapper.and(w -> w
                    .like(User::getUsername, keyword)
                    .or()
                    .like(User::getNickname, keyword)
                    .or()
                    .like(User::getEmail, keyword)
            );
        }

        // 角色筛选
        if (StringUtils.hasText(role)) {
            queryWrapper.eq(User::getRole, role);
        }

        // 状态筛选
        if (status != null) {
            queryWrapper.eq(User::getStatus, status);
        }

        // 分页查询
        Page<User> page = new Page<>(pageNum, pageSize);
        Page<User> userPage = userMapper.selectPage(page, queryWrapper);

        // 转换为响应DTO
        List<UserResponse> userResponses = userPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PageResult<>(userResponses, userPage.getTotal(), pageNum, pageSize);
    }

    /**
     * 获取用户详情
     *
     * @param id 用户ID
     * @return 用户详情
     */
    public UserResponse getUserById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }
        return convertToResponse(user);
    }

    /**
     * 创建用户
     *
     * @param request 创建请求
     * @return 用户详情
     */
    @Transactional(rollbackFor = Exception.class)
    public UserResponse createUser(UserCreateRequest request) {
        // 检查用户名是否已存在
        Long count = userMapper.selectCount(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, request.getUsername())
        );
        if (count > 0) {
            throw new BusinessException(400, "用户名已存在");
        }

        // 创建用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNickname(StringUtils.hasText(request.getNickname()) ? request.getNickname() : request.getUsername());
        user.setEmail(request.getEmail());
        user.setAvatar(request.getAvatar());
        user.setRole(request.getRole());
        user.setStatus(1); // 默认启用

        userMapper.insert(user);
        log.info("创建用户成功: {}", user.getUsername());

        return convertToResponse(user);
    }

    /**
     * 更新用户
     *
     * @param id      用户ID
     * @param request 更新请求
     * @return 用户详情
     */
    @Transactional(rollbackFor = Exception.class)
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }

        // 更新用户信息
        if (StringUtils.hasText(request.getNickname())) {
            user.setNickname(request.getNickname());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (StringUtils.hasText(request.getRole())) {
            user.setRole(request.getRole());
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
        // 如果提供了新密码，则更新密码
        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userMapper.updateById(user);
        log.info("更新用户成功: {}", user.getUsername());

        return convertToResponse(user);
    }

    /**
     * 删除用户（逻辑删除）
     *
     * @param id 用户ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteUser(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }

        // 逻辑删除
        userMapper.deleteById(id);
        log.info("删除用户成功: {}", user.getUsername());
    }

    /**
     * 切换用户状态
     *
     * @param id     用户ID
     * @param status 状态（1: 启用, 0: 禁用）
     * @return 用户详情
     */
    @Transactional(rollbackFor = Exception.class)
    public UserResponse toggleUserStatus(Long id, Integer status) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }

        user.setStatus(status);
        userMapper.updateById(user);
        log.info("用户状态更新成功: {} -> {}", user.getUsername(), status == 1 ? "启用" : "禁用");

        return convertToResponse(user);
    }

    /**
     * 转换为响应DTO
     */
    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .status(user.getStatus())
                .lastLoginTime(user.getLastLoginTime())
                .createTime(user.getCreateTime())
                .build();
    }

}
