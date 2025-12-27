package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.entity.Store;
import com.restaurant.mapper.StoreMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private StoreMapper storeMapper;

    @Override
    public Page<Store> getStoreList(Integer pageNum, Integer pageSize, String keyword, String city, String orderBy) {
        Page<Store> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Store> wrapper = new LambdaQueryWrapper<>();
        
        // 关键词搜索
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like(Store::getStoreName, keyword)
                    .or().like(Store::getStoreType, keyword)
                    .or().like(Store::getTags, keyword));
        }
        
        // 城市筛选
        if (city != null && !city.isEmpty()) {
            wrapper.eq(Store::getCity, city);
        }
        
        // 排序
        if ("distance".equals(orderBy)) {
            // 实际应用中需要根据用户位置计算距离
            wrapper.orderByDesc(Store::getId);
        } else if ("rating".equals(orderBy)) {
            wrapper.orderByDesc(Store::getRating);
        } else if ("saleCount".equals(orderBy)) {
            wrapper.orderByDesc(Store::getSaleCount);
        } else {
            wrapper.orderByDesc(Store::getCreateTime);
        }
        
        wrapper.eq(Store::getDeleted, 0);
        
        return storeMapper.selectPage(page, wrapper);
    }

    @Override
    public Store getStoreById(Long id) {
        return storeMapper.selectById(id);
    }

    @Override
    public void createStore(Store store) {
        store.setRating(BigDecimal.valueOf(5.0));
        store.setSaleCount(0);
        store.setStatus(1);
        storeMapper.insert(store);
    }

    @Override
    public void updateStore(Store store) {
        storeMapper.updateById(store);
    }

    @Override
    public void deleteStore(Long id) {
        Store store = new Store();
        store.setId(id);
        store.setDeleted(1);
        storeMapper.updateById(store);
    }

    @Override
    public List<Store> getAllActiveStores() {
        LambdaQueryWrapper<Store> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Store::getStatus, 1);
        wrapper.eq(Store::getDeleted, 0);
        return storeMapper.selectList(wrapper);
    }
}