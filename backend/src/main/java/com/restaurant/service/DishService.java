package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.entity.Dish;
import com.restaurant.mapper.DishMapper;
import com.restaurant.mapper.DishCategoryMapper;
import com.restaurant.mapper.StoreMapper;
import com.restaurant.entity.DishCategory;
import com.restaurant.entity.Store;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 菜品服务
 */
@Service
public class DishService {

    @Autowired
    private DishMapper dishMapper;

    @Autowired
    private DishCategoryMapper dishCategoryMapper;

    @Autowired
    private StoreMapper storeMapper;

    /**
     * 分页查询菜品列表
     */
    public Page<Dish> getDishList(Integer pageNum, Integer pageSize, String keyword, Long categoryId, Long storeId, String orderBy) {
        Page<Dish> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Dish> wrapper = new LambdaQueryWrapper<>();
        
        // 关键词搜索
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like(Dish::getDishName, keyword)
                    .or().like(Dish::getDescription, keyword)
                    .or().like(Dish::getTags, keyword));
        }
        
        // 分类筛选
        if (categoryId != null) {
            wrapper.eq(Dish::getCategoryId, categoryId);
        }
        
        // 门店筛选
        if (storeId != null) {
            wrapper.and(w -> w.eq(Dish::getStoreId, storeId).or().eq(Dish::getStoreId, 0));
        }
        
        // 只查询已上架的菜品
        wrapper.eq(Dish::getStatus, 1);
        
        // 排序
        if ("saleCount".equals(orderBy)) {
            wrapper.orderByDesc(Dish::getSaleCount);
        } else if ("price".equals(orderBy)) {
            wrapper.orderByAsc(Dish::getPrice);
        } else if ("rating".equals(orderBy)) {
            wrapper.orderByDesc(Dish::getRating);
        } else {
            wrapper.orderByDesc(Dish::getCreateTime);
        }
        
        Page<Dish> result = dishMapper.selectPage(page, wrapper);
        
        // 补充分类名和门店名
        for (Dish dish : result.getRecords()) {
            if (dish.getCategoryId() != null) {
                DishCategory category = dishCategoryMapper.selectById(dish.getCategoryId());
                if (category != null) {
                    dish.setCategoryName(category.getCategoryName());
                }
            }
            if (dish.getStoreId() != null) {
                Store store = storeMapper.selectById(dish.getStoreId());
                if (store != null) {
                    dish.setStoreName(store.getStoreName());
                }
            }
        }
        
        return result;
    }

    /**
     * 获取菜品详情
     */
    public Dish getDishById(Long id) {
        return dishMapper.selectById(id);
    }

    /**
     * 创建菜品
     */
    public void createDish(Dish dish) {
        if (dish.getRating() == null) {
            dish.setRating(java.math.BigDecimal.valueOf(5.0));
        }
        if (dish.getSaleCount() == null) {
            dish.setSaleCount(0);
        }
        if (dish.getStock() == null) {
            dish.setStock(999);
        }
        if (dish.getStatus() == null) {
            dish.setStatus(1);
        }
        dishMapper.insert(dish);
    }

    /**
     * 更新菜品
     */
    public void updateDish(Dish dish) {
        dishMapper.updateById(dish);
    }

    /**
     * 删除菜品
     */
    public void deleteDish(Long id) {
        dishMapper.deleteById(id);
    }

    /**
     * 获取推荐菜品
     */
    public List<Dish> getRecommendDishes(Integer limit) {
        LambdaQueryWrapper<Dish> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Dish::getIsRecommend, 1)
                .eq(Dish::getStatus, 1)
                .orderByDesc(Dish::getSaleCount)
                .last("LIMIT " + (limit != null ? limit : 10));
        return dishMapper.selectList(wrapper);
    }

    /**
     * 获取新品菜品
     */
    public List<Dish> getNewDishes(Integer limit) {
        LambdaQueryWrapper<Dish> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Dish::getIsNew, 1)
                .eq(Dish::getStatus, 1)
                .orderByDesc(Dish::getCreateTime)
                .last("LIMIT " + (limit != null ? limit : 10));
        return dishMapper.selectList(wrapper);
    }

    /**
     * 获取热销菜品TOP
     */
    public List<Dish> getTopSalesDishes(Integer limit) {
        LambdaQueryWrapper<Dish> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Dish::getStatus, 1)
                .orderByDesc(Dish::getSaleCount)
                .last("LIMIT " + (limit != null ? limit : 10));
        
        List<Dish> dishes = dishMapper.selectList(wrapper);
        
        // 补充分类名和门店名
        for (Dish dish : dishes) {
            if (dish.getCategoryId() != null) {
                DishCategory category = dishCategoryMapper.selectById(dish.getCategoryId());
                if (category != null) {
                    dish.setCategoryName(category.getCategoryName());
                }
            }
            if (dish.getStoreId() != null) {
                Store store = storeMapper.selectById(dish.getStoreId());
                if (store != null) {
                    dish.setStoreName(store.getStoreName());
                }
            }
        }
        
        return dishes;
    }
}
