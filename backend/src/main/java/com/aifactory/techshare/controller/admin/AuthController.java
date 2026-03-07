package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.ChangePasswordRequest;
import com.aifactory.techshare.dto.LoginRequest;
import com.aifactory.techshare.dto.LoginResponse;
import com.aifactory.techshare.dto.UpdateProfileRequest;
import com.aifactory.techshare.dto.UserProfileResponse;
import com.aifactory.techshare.entity.User;
import com.aifactory.techshare.exception.BusinessException;
import com.aifactory.techshare.mapper.UserMapper;
import com.aifactory.techshare.security.CustomUserDetailsService;
import com.aifactory.techshare.security.JwtUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

/**
 * 认证控制器
 * 处理管理员登录、登出、用户信息等认证相关操作
 *
 * @author AI Factory
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/admin/auth")
@RequiredArgsConstructor
@Tag(name = "认证管理（管理端）", description = "管理员登录、登出、个人信息管理接口")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.expiration}")
    private Long tokenExpiration;

    /**
     * 管理员登录
     *
     * @param request 登录请求
     * @return 登录响应（包含Token和用户信息）
     */
    @PostMapping("/login")
    @Operation(summary = "管理员登录", description = "使用用户名和密码登录，返回 JWT Token")
    @ApiResponse(responseCode = "200", description = "登录成功")
    @ApiResponse(responseCode = "401", description = "用户名或密码错误")
    @ApiResponse(responseCode = "403", description = "用户已被禁用")
    public Result<LoginResponse> login(
            @RequestBody(description = "登录信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody LoginRequest request) {
        log.info("用户登录请求: {}", request.getUsername());

        // 查询用户
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, request.getUsername())
        );

        // 验证用户是否存在
        if (user == null) {
            log.warn("登录失败: 用户不存在 - {}", request.getUsername());
            throw new BusinessException(4001, "用户名或密码错误");
        }

        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("登录失败: 密码错误 - {}", request.getUsername());
            throw new BusinessException(4001, "用户名或密码错误");
        }

        // 检查用户状态
        if (user.getStatus() == null || user.getStatus() == 0) {
            log.warn("登录失败: 用户已被禁用 - {}", request.getUsername());
            throw new BusinessException(4004, "用户已被禁用，请联系管理员");
        }

        // 生成Token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // 更新最后登录时间
        userMapper.update(null, new LambdaUpdateWrapper<User>()
                .eq(User::getId, user.getId())
                .set(User::getLastLoginTime, LocalDateTime.now())
        );

        log.info("用户登录成功: {}", user.getUsername());

        // 构建响应
        LoginResponse.UserInfo userInfo = LoginResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .build();

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(tokenExpiration)
                .userInfo(userInfo)
                .build();

        return Result.success(response);
    }

    /**
     * 管理员登出
     * 前端删除Token即可，服务端无状态
     *
     * @return 成功响应
     */
    @PostMapping("/logout")
    @Operation(summary = "管理员登出", description = "退出登录，前端删除 Token 即可")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponse(responseCode = "200", description = "登出成功")
    public Result<Void> logout(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null) {
            log.info("用户登出: {}", userDetails.getUsername());
        }
        return Result.success("登出成功", null);
    }

    /**
     * 获取当前登录用户信息
     *
     * @param userDetails 当前登录用户
     * @return 用户详细信息
     */
    @GetMapping("/profile")
    @Operation(summary = "获取当前用户信息", description = "获取当前登录用户的详细信息")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "401", description = "未登录")
    public Result<UserProfileResponse> getProfile(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new BusinessException(401, "未登录");
        }

        User user = userDetailsService.getUserByUsername(userDetails.getUsername());
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }

        UserProfileResponse profile = UserProfileResponse.builder()
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

        return Result.success(profile);
    }

    /**
     * 更新当前用户信息
     *
     * @param userDetails  当前登录用户
     * @param request      更新请求
     * @return 更新后的用户信息
     */
    @PutMapping("/profile")
    @Operation(summary = "更新当前用户信息", description = "更新当前登录用户的个人信息（昵称、邮箱、头像）")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponse(responseCode = "200", description = "更新成功")
    @ApiResponse(responseCode = "401", description = "未登录")
    public Result<UserProfileResponse> updateProfile(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(description = "用户信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody UpdateProfileRequest request
    ) {
        if (userDetails == null) {
            throw new BusinessException(401, "未登录");
        }

        User user = userDetailsService.getUserByUsername(userDetails.getUsername());
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }

        // 更新用户信息
        LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<User>()
                .eq(User::getId, user.getId());

        if (request.getNickname() != null) {
            updateWrapper.set(User::getNickname, request.getNickname());
        }
        if (request.getEmail() != null) {
            updateWrapper.set(User::getEmail, request.getEmail());
        }
        if (request.getAvatar() != null) {
            updateWrapper.set(User::getAvatar, request.getAvatar());
        }

        userMapper.update(null, updateWrapper);

        log.info("用户信息更新成功: {}", user.getUsername());

        // 返回更新后的信息
        User updatedUser = userDetailsService.getUserByUsername(userDetails.getUsername());
        UserProfileResponse profile = UserProfileResponse.builder()
                .id(updatedUser.getId())
                .username(updatedUser.getUsername())
                .nickname(updatedUser.getNickname())
                .email(updatedUser.getEmail())
                .avatar(updatedUser.getAvatar())
                .role(updatedUser.getRole())
                .status(updatedUser.getStatus())
                .lastLoginTime(updatedUser.getLastLoginTime())
                .createTime(updatedUser.getCreateTime())
                .build();

        return Result.success(profile);
    }

    /**
     * 修改密码
     *
     * @param userDetails 当前登录用户
     * @param request     修改密码请求
     * @return 成功响应
     */
    @PutMapping("/password")
    @Operation(summary = "修改密码", description = "修改当前登录用户的密码")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponse(responseCode = "200", description = "修改成功")
    @ApiResponse(responseCode = "400", description = "原密码错误或新密码不符合要求")
    @ApiResponse(responseCode = "401", description = "未登录")
    public Result<Void> changePassword(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(description = "密码信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody ChangePasswordRequest request
    ) {
        if (userDetails == null) {
            throw new BusinessException(401, "未登录");
        }

        User user = userDetailsService.getUserByUsername(userDetails.getUsername());
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }

        // 验证原密码
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BusinessException(400, "原密码错误");
        }

        // 新密码不能与原密码相同
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BusinessException(400, "新密码不能与原密码相同");
        }

        // 更新密码
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        userMapper.update(null, new LambdaUpdateWrapper<User>()
                .eq(User::getId, user.getId())
                .set(User::getPassword, encodedPassword)
        );

        log.info("用户密码修改成功: {}", user.getUsername());

        return Result.success("密码修改成功", null);
    }

}
