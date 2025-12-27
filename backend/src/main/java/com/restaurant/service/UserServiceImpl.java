package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.entity.User;
import com.restaurant.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

/**
 * 用户服务实现
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public Page<User> getUserList(Integer pageNum, Integer pageSize, String username, String userType, String memberLevel) {
        Page<User> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        
        if (username != null && !username.isEmpty()) {
            wrapper.like(User::getUsername, username);
        }
        
        if (userType != null && !userType.isEmpty()) {
            wrapper.eq(User::getUserType, userType);
        }
        
        if (memberLevel != null && !memberLevel.isEmpty()) {
            wrapper.eq(User::getMemberLevel, memberLevel);
        }
        
        wrapper.eq(User::getDeleted, 0);
        wrapper.orderByDesc(User::getCreateTime);
        
        return userMapper.selectPage(page, wrapper);
    }

    @Override
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }

    @Override
    public void createUser(User user) {
        // 密码加密
        if (user.getPassword() != null) {
            user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
        }
        userMapper.insert(user);
    }

    @Override
    public void updateUser(User user) {
        // 如果修改了密码，需要加密
        if (user.getPassword() != null && !user.getPassword().startsWith("e10adc") && user.getPassword().length() < 50) {
            user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
        }
        userMapper.updateById(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = new User();
        user.setId(id);
        user.setDeleted(1);
        userMapper.updateById(user);
    }

    @Override
    public User getUserByUsername(String username) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, username);
        wrapper.eq(User::getDeleted, 0);
        return userMapper.selectOne(wrapper);
    }

    @Override
    public Long getTotalCount() {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getDeleted, 0);
        return userMapper.selectCount(wrapper);
    }
}
