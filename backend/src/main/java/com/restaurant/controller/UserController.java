package com.restaurant.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.common.Result;
import com.restaurant.entity.User;
import com.restaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 获取用户列表(分页)
     */
    @GetMapping("/list")
    public Result<Page<User>> getUserList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) String memberLevel) {
        try {
            Page<User> page = userService.getUserList(pageNum, pageSize, username, userType, memberLevel);
            return Result.success(page);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取用户详情
     */
    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return Result.success(user);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 创建用户
     */
    @PostMapping
    public Result<String> createUser(@RequestBody User user) {
        try {
            userService.createUser(user);
            return Result.success("创建成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新用户
     */
    @PutMapping("/{id}")
    public Result<String> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            user.setId(id);
            userService.updateUser(user);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    public Result<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新用户状态
     */
    @PatchMapping("/{id}/status")
    public Result<String> updateUserStatus(@PathVariable Long id, @RequestBody User user) {
        try {
            User existing = userService.getUserById(id);
            existing.setStatus(user.getStatus());
            userService.updateUser(existing);
            return Result.success("状态更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取用户总数
     */
    @GetMapping("/total-count")
    public Result<Long> getTotalCount() {
        try {
            Long count = userService.getTotalCount();
            return Result.success(count);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
