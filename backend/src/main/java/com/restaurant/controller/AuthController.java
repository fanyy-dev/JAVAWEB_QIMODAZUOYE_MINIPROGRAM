package com.restaurant.controller;

import com.restaurant.common.Result;
import com.restaurant.dto.LoginRequest;
import com.restaurant.dto.LoginResponse;
import com.restaurant.entity.User;
import com.restaurant.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return Result.success(response);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public Result<String> register(@RequestBody User user) {
        try {
            authService.register(user);
            return Result.success("注册成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
