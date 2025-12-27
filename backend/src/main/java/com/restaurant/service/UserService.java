package com.restaurant.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.entity.User;

public interface UserService {
    Page<User> getUserList(Integer pageNum, Integer pageSize, String username, String userType, String memberLevel);
    User getUserById(Long id);
    void createUser(User user);
    void updateUser(User user);
    void deleteUser(Long id);
    User getUserByUsername(String username);
    Long getTotalCount();
}
