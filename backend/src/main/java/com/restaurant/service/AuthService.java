package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.restaurant.dto.LoginRequest;
import com.restaurant.dto.LoginResponse;
import com.restaurant.entity.User;
import com.restaurant.mapper.UserMapper;
import com.restaurant.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

/**
 * 认证服务
 */
@Service
public class AuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 用户登录
     */
    public LoginResponse login(LoginRequest request) {
        // 查询用户
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, request.getUsername());
        User user = userMapper.selectOne(wrapper);

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证密码 (MD5加密)
        String encryptedPassword = DigestUtils.md5DigestAsHex(request.getPassword().getBytes());
        if (!encryptedPassword.equals(user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 检查用户状态
        if (user.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }

        // 生成token
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getUserType());

        // 构建返回结果
        LoginResponse response = new LoginResponse();
        response.setToken(token);

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setUsername(user.getUsername());
        userInfo.setNickname(user.getNickname());
        userInfo.setAvatar(user.getAvatar());
        userInfo.setPhone(user.getPhone());
        userInfo.setUserType(user.getUserType());
        userInfo.setMemberLevel(user.getMemberLevel());
        userInfo.setPoints(user.getPoints());

        response.setUserInfo(userInfo);

        return response;
    }

    /**
     * 用户注册
     */
    public void register(User user) {
        // 检查用户名是否已存在
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, user.getUsername());
        if (userMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("用户名已存在");
        }

        // 检查手机号是否已存在
        if (user.getPhone() != null) {
            wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getPhone, user.getPhone());
            if (userMapper.selectCount(wrapper) > 0) {
                throw new RuntimeException("手机号已被注册");
            }
        }

        // 密码加密
        user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
        
        // 设置默认值
        if (user.getUserType() == null) {
            user.setUserType("USER");
        }
        if (user.getMemberLevel() == null) {
            user.setMemberLevel("NORMAL");
        }
        user.setGrowthValue(0);
        user.setPoints(0);
        user.setStatus(1);

        userMapper.insert(user);
    }
}
