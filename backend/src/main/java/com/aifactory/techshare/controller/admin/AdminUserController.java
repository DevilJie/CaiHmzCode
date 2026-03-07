package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.UserCreateRequest;
import com.aifactory.techshare.dto.UserResponse;
import com.aifactory.techshare.dto.UserUpdateRequest;
import com.aifactory.techshare.service.AdminUserService;
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
 * 用户管理控制器（管理端）
 * 需要SUPER_ADMIN角色
 *
 * @author AI Factory
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

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
    @GetMapping
    public Result<PageResult<UserResponse>> getUserList(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Integer status
    ) {
        PageResult<UserResponse> result = adminUserService.getUserList(pageNum, pageSize, keyword, role, status);
        return Result.success(result);
    }

    /**
     * 获取用户详情
     *
     * @param id 用户ID
     * @return 用户详情
     */
    @GetMapping("/{id}")
    public Result<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse response = adminUserService.getUserById(id);
        return Result.success(response);
    }

    /**
     * 创建用户
     *
     * @param request 创建请求
     * @return 用户详情
     */
    @PostMapping
    public Result<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        UserResponse response = adminUserService.createUser(request);
        return Result.success("创建用户成功", response);
    }

    /**
     * 更新用户
     *
     * @param id      用户ID
     * @param request 更新请求
     * @return 用户详情
     */
    @PutMapping("/{id}")
    public Result<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = adminUserService.updateUser(id, request);
        return Result.success("更新用户成功", response);
    }

    /**
     * 删除用户（逻辑删除）
     *
     * @param id 用户ID
     * @return 成功响应
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return Result.success("删除用户成功", null);
    }

    /**
     * 切换用户状态
     *
     * @param id     用户ID
     * @param status 状态（1: 启用, 0: 禁用）
     * @return 用户详情
     */
    @PutMapping("/{id}/status")
    public Result<UserResponse> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam Integer status
    ) {
        UserResponse response = adminUserService.toggleUserStatus(id, status);
        return Result.success(status == 1 ? "用户已启用" : "用户已禁用", response);
    }

}
