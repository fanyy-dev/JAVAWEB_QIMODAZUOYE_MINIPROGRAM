package com.restaurant.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.common.Result;
import com.restaurant.entity.DishCategory;
import com.restaurant.service.DishCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 菜品分类控制器
 */
@RestController
@RequestMapping("/dish-category")
public class DishCategoryController {

    @Autowired
    private DishCategoryService dishCategoryService;

    /**
     * 获取菜品分类列表(分页)
     */
    @GetMapping("/list")
    public Result<Page<DishCategory>> getCategoryList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) String keyword) {
        try {
            Page<DishCategory> page = dishCategoryService.getCategoryList(pageNum, pageSize, storeId, keyword);
            return Result.success(page);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取分类详情
     */
    @GetMapping("/{id}")
    public Result<DishCategory> getCategoryById(@PathVariable Long id) {
        try {
            DishCategory category = dishCategoryService.getCategoryById(id);
            return Result.success(category);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 创建分类
     */
    @PostMapping
    public Result<String> createCategory(@RequestBody DishCategory category) {
        try {
            dishCategoryService.createCategory(category);
            return Result.success("创建成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新分类
     */
    @PutMapping("/{id}")
    public Result<String> updateCategory(@PathVariable Long id, @RequestBody DishCategory category) {
        try {
            category.setId(id);
            dishCategoryService.updateCategory(category);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 删除分类
     */
    @DeleteMapping("/{id}")
    public Result<String> deleteCategory(@PathVariable Long id) {
        try {
            dishCategoryService.deleteCategory(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
