package com.restaurant.controller;

import com.restaurant.common.Result;
import com.restaurant.entity.UserAddress;
import com.restaurant.service.UserAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 用户地址控制器
 */
@RestController
@RequestMapping("/address")
public class UserAddressController {

    @Autowired
    private UserAddressService addressService;

    /**
     * 获取用户的所有地址
     */
    @GetMapping("/list")
    public Result<List<UserAddress>> getAddressList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<UserAddress> addresses = addressService.getUserAddresses(userId);
        return Result.success(addresses);
    }

    /**
     * 获取地址详情
     */
    @GetMapping("/{id}")
    public Result<UserAddress> getAddressDetail(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        UserAddress address = addressService.getAddressById(id);
        
        if (address == null) {
            return Result.error("地址不存在");
        }
        
        // 验证地址归属
        if (!address.getUserId().equals(userId)) {
            return Result.error("无权访问此地址");
        }
        
        return Result.success(address);
    }

    /**
     * 添加地址
     */
    @PostMapping("/add")
    public Result<UserAddress> addAddress(@RequestBody UserAddress address, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        address.setUserId(userId);
        
        // 设置默认值
        if (address.getIsDefault() == null) {
            address.setIsDefault(0);
        }
        
        UserAddress savedAddress = addressService.addAddress(address);
        return Result.success(savedAddress);
    }

    /**
     * 更新地址
     */
    @PutMapping("/update")
    public Result<UserAddress> updateAddress(@RequestBody UserAddress address, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        
        // 验证地址归属
        UserAddress existingAddress = addressService.getAddressById(address.getId());
        if (existingAddress == null) {
            return Result.error("地址不存在");
        }
        if (!existingAddress.getUserId().equals(userId)) {
            return Result.error("无权修改此地址");
        }
        
        address.setUserId(userId);
        UserAddress updatedAddress = addressService.updateAddress(address);
        return Result.success(updatedAddress);
    }

    /**
     * 删除地址
     */
    @DeleteMapping("/{id}")
    public Result<String> deleteAddress(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        
        // 验证地址归属
        UserAddress address = addressService.getAddressById(id);
        if (address == null) {
            return Result.error("地址不存在");
        }
        if (!address.getUserId().equals(userId)) {
            return Result.error("无权删除此地址");
        }
        
        boolean success = addressService.deleteAddress(id);
        return success ? Result.success("删除成功") : Result.error("删除失败");
    }

    /**
     * 设置默认地址
     */
    @PutMapping("/setDefault/{id}")
    public Result<String> setDefaultAddress(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        
        // 验证地址归属
        UserAddress address = addressService.getAddressById(id);
        if (address == null) {
            return Result.error("地址不存在");
        }
        if (!address.getUserId().equals(userId)) {
            return Result.error("无权操作此地址");
        }
        
        boolean success = addressService.setDefaultAddress(userId, id);
        return success ? Result.success("设置成功") : Result.error("设置失败");
    }

    /**
     * 获取默认地址
     */
    @GetMapping("/default")
    public Result<UserAddress> getDefaultAddress(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        UserAddress address = addressService.getDefaultAddress(userId);
        return Result.success(address);
    }
}
