package com.restaurant.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.entity.Store;

import java.util.List;

/**
 * 门店服务接口
 */
public interface StoreService {
    /**
     * 分页查询门店列表
     */
    Page<Store> getStoreList(Integer pageNum, Integer pageSize, String keyword, String city, String orderBy);

    /**
     * 获取门店详情
     */
    Store getStoreById(Long id);

    /**
     * 创建门店
     */
    void createStore(Store store);

    /**
     * 更新门店
     */
    void updateStore(Store store);

    /**
     * 删除门店
     */
    void deleteStore(Long id);

    /**
     * 获取所有营业中的门店
     */
    List<Store> getAllActiveStores();
}