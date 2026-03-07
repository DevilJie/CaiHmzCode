package com.aifactory.techshare.controller.admin;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.common.Result;
import com.aifactory.techshare.dto.UserCreateRequest;
import com.aifactory.techshare.dto.UserResponse;
import com.aifactory.techshare.dto.UserUpdateRequest;
import com.aifactory.techshare.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
@Validated
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
@Tag(name = "用户管理（管理端）", description = "用户的增删改查、状态管理等接口，需要 SUPER_ADMIN 角色")
@SecurityRequirement(name = "Bearer Authentication")
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
    @Operation(summary = "获取用户列表", description = "分页查询所有用户，支持按角色、状态、关键词筛选")
    @ApiResponse(responseCode = "200", description = "查询成功")
    public Result<PageResult<UserResponse>> getUserList(
            @Parameter(description = "页码，从1开始", example = "1")
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为1") int pageNum,
            @Parameter(description = "每页数量，最大100", example = "10")
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "每页数量最小为1") @Max(value = 100, message = "每页数量最大为100") int pageSize,
            @Parameter(description = "搜索关键词（用户名/昵称/邮箱）", example = "admin")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "角色筛选：ADMIN-管理员，SUPER_ADMIN-超级管理员", example = "ADMIN")
            @RequestParam(required = false) String role,
            @Parameter(description = "状态筛选：0-禁用，1-启用", example = "1")
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
    @Operation(summary = "获取用户详情", description = "根据ID获取用户详细信息")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @ApiResponse(responseCode = "404", description = "用户不存在")
    public Result<UserResponse> getUserById(
            @Parameter(description = "用户ID", required = true, example = "1")
            @PathVariable @NotNull(message = "用户ID不能为空") Long id) {
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
    @Operation(summary = "创建用户", description = "创建新用户")
    @ApiResponse(responseCode = "200", description = "创建成功")
    @ApiResponse(responseCode = "400", description = "参数验证失败或用户名已存在")
    public Result<UserResponse> createUser(
            @RequestBody(description = "用户信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody UserCreateRequest request) {
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
    @Operation(summary = "更新用户", description = "更新用户的基本信息")
    @ApiResponse(responseCode = "200", description = "更新成功")
    @ApiResponse(responseCode = "404", description = "用户不存在")
    public Result<UserResponse> updateUser(
            @Parameter(description = "用户ID", required = true, example = "1")
            @PathVariable @NotNull(message = "用户ID不能为空") Long id,
            @RequestBody(description = "用户信息", required = true)
            @Valid @org.springframework.web.bind.annotation.RequestBody UserUpdateRequest request) {
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
    @Operation(summary = "删除用户", description = "逻辑删除用户")
    @ApiResponse(responseCode = "200", description = "删除成功")
    @ApiResponse(responseCode = "404", description = "用户不存在")
    public Result<Void> deleteUser(
            @Parameter(description = "用户ID", required = true, example = "1")
            @PathVariable @NotNull(message = "用户ID不能为空") Long id) {
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
    @Operation(summary = "切换用户状态", description = "启用或禁用用户")
    @ApiResponse(responseCode = "200", description = "操作成功")
    @ApiResponse(responseCode = "404", description = "用户不存在")
    public Result<UserResponse> toggleUserStatus(
            @Parameter(description = "用户ID", required = true, example = "1")
            @PathVariable @NotNull(message = "用户ID不能为空") Long id,
            @Parameter(description = "状态：0-禁用，1-启用", required = true, example = "1")
            @RequestParam @Min(value = 0, message = "状态值只能是0或1") @Max(value = 1, message = "状态值只能是0或1") Integer status
    ) {
        UserResponse response = adminUserService.toggleUserStatus(id, status);
        return Result.success(status == 1 ? "用户已启用" : "用户已禁用", response);
    }

}
