package com.restaurant.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.common.Result;
import com.restaurant.entity.Dish;
import com.restaurant.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜品控制器
 */
@RestController
@RequestMapping("/dish")
public class DishController {

    @Autowired
    private DishService dishService;

    /**
     * 查询菜品列表(分页)
     */
    @GetMapping("/list")
    public Result<Page<Dish>> getDishList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) String orderBy) {
        try {
            Page<Dish> page = dishService.getDishList(pageNum, pageSize, keyword, categoryId, storeId, orderBy);
            return Result.success(page);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取菜品详情
     */
    @GetMapping("/{id}")
    public Result<Dish> getDishById(@PathVariable Long id) {
        try {
            Dish dish = dishService.getDishById(id);
            return Result.success(dish);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 创建菜品
     */
    @PostMapping
    public Result<String> createDish(@RequestBody Dish dish) {
        try {
            dishService.createDish(dish);
            return Result.success("创建成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新菜品
     */
    @PutMapping
    public Result<String> updateDish(@RequestBody Dish dish) {
        try {
            dishService.updateDish(dish);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 删除菜品
     */
    @DeleteMapping("/{id}")
    public Result<String> deleteDish(@PathVariable Long id) {
        try {
            dishService.deleteDish(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新菜品状态
     */
    @PatchMapping("/{id}/status")
    public Result<String> updateDishStatus(@PathVariable Long id, @RequestBody Dish dish) {
        try {
            Dish existing = dishService.getDishById(id);
            existing.setStatus(dish.getStatus());
            dishService.updateDish(existing);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取推荐菜品
     */
    @GetMapping("/recommend")
    public Result<List<Dish>> getRecommendDishes(@RequestParam(required = false) Integer limit) {
        try {
            List<Dish> dishes = dishService.getRecommendDishes(limit);
            return Result.success(dishes);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取新品菜品
     */
    @GetMapping("/new")
    public Result<List<Dish>> getNewDishes(@RequestParam(required = false) Integer limit) {
        try {
            List<Dish> dishes = dishService.getNewDishes(limit);
            return Result.success(dishes);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取热销菜品TOP10
     */
    @GetMapping("/top-sales")
    public Result<List<Dish>> getTopSalesDishes(@RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<Dish> dishes = dishService.getTopSalesDishes(limit);
            return Result.success(dishes);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
