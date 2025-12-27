package com.restaurant.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.common.Result;
import com.restaurant.entity.Store;
import com.restaurant.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 门店控制器
 */
@RestController
@RequestMapping("/store")
public class StoreController {

    @Autowired
    private StoreService storeService;

    /**
     * 查询门店列表(分页)
     */
    @GetMapping("/list")
    public Result<Page<Store>> getStoreList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String orderBy) {
        try {
            Page<Store> page = storeService.getStoreList(pageNum, pageSize, keyword, city, orderBy);
            return Result.success(page);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取门店详情
     */
    @GetMapping("/{id}")
    public Result<Store> getStoreById(@PathVariable Long id) {
        try {
            Store store = storeService.getStoreById(id);
            return Result.success(store);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 创建门店
     */
    @PostMapping
    public Result<String> createStore(@RequestBody Store store) {
        try {
            storeService.createStore(store);
            return Result.success("创建成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新门店
     */
    @PutMapping
    public Result<String> updateStore(@RequestBody Store store) {
        try {
            storeService.updateStore(store);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 删除门店
     */
    @DeleteMapping("/{id}")
    public Result<String> deleteStore(@PathVariable Long id) {
        try {
            storeService.deleteStore(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取所有营业中的门店
     */
    @GetMapping("/active")
    public Result<List<Store>> getAllActiveStores() {
        try {
            List<Store> stores = storeService.getAllActiveStores();
            return Result.success(stores);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
