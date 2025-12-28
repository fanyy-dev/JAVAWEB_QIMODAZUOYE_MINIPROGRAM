package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.restaurant.entity.UserAddress;
import com.restaurant.mapper.UserAddressMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户地址服务类
 */
@Service
public class UserAddressService {

    @Autowired
    private UserAddressMapper userAddressMapper;

    /**
     * 获取用户的所有地址
     */
    public List<UserAddress> getUserAddresses(Long userId) {
        LambdaQueryWrapper<UserAddress> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserAddress::getUserId, userId)
               .orderByDesc(UserAddress::getIsDefault)
               .orderByDesc(UserAddress::getUpdateTime);
        return userAddressMapper.selectList(wrapper);
    }

    /**
     * 根据ID获取地址详情
     */
    public UserAddress getAddressById(Long id) {
        return userAddressMapper.selectById(id);
    }

    /**
     * 添加地址
     */
    @Transactional
    public UserAddress addAddress(UserAddress address) {
        // 如果设置为默认地址，先取消其他默认地址
        if (address.getIsDefault() != null && address.getIsDefault() == 1) {
            cancelOtherDefaultAddress(address.getUserId());
        }
        userAddressMapper.insert(address);
        return address;
    }

    /**
     * 更新地址
     */
    @Transactional
    public UserAddress updateAddress(UserAddress address) {
        // 如果设置为默认地址，先取消其他默认地址
        if (address.getIsDefault() != null && address.getIsDefault() == 1) {
            cancelOtherDefaultAddress(address.getUserId());
        }
        userAddressMapper.updateById(address);
        return address;
    }

    /**
     * 删除地址
     */
    public boolean deleteAddress(Long id) {
        return userAddressMapper.deleteById(id) > 0;
    }

    /**
     * 设置默认地址
     */
    @Transactional
    public boolean setDefaultAddress(Long userId, Long addressId) {
        // 先取消其他默认地址
        cancelOtherDefaultAddress(userId);
        
        // 设置当前地址为默认
        LambdaUpdateWrapper<UserAddress> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(UserAddress::getId, addressId)
               .eq(UserAddress::getUserId, userId)
               .set(UserAddress::getIsDefault, 1);
        return userAddressMapper.update(null, wrapper) > 0;
    }

    /**
     * 获取默认地址
     */
    public UserAddress getDefaultAddress(Long userId) {
        LambdaQueryWrapper<UserAddress> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserAddress::getUserId, userId)
               .eq(UserAddress::getIsDefault, 1)
               .last("LIMIT 1");
        return userAddressMapper.selectOne(wrapper);
    }

    /**
     * 取消其他默认地址
     */
    private void cancelOtherDefaultAddress(Long userId) {
        LambdaUpdateWrapper<UserAddress> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(UserAddress::getUserId, userId)
               .set(UserAddress::getIsDefault, 0);
        userAddressMapper.update(null, wrapper);
    }
}
