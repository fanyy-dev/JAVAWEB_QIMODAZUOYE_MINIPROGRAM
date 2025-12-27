package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.entity.DishCategory;
import com.restaurant.mapper.DishCategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 菜品分类服务实现
 */
@Service
public class DishCategoryServiceImpl implements DishCategoryService {

    @Autowired
    private DishCategoryMapper dishCategoryMapper;

    @Override
    public Page<DishCategory> getCategoryList(Integer pageNum, Integer pageSize, Long storeId, String keyword) {
        Page<DishCategory> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<DishCategory> wrapper = new LambdaQueryWrapper<>();
        
        if (storeId != null) {
            wrapper.eq(DishCategory::getStoreId, storeId);
        }
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(DishCategory::getCategoryName, keyword);
        }
        
        wrapper.eq(DishCategory::getDeleted, 0);
        wrapper.orderByAsc(DishCategory::getSortOrder);
        
        return dishCategoryMapper.selectPage(page, wrapper);
    }

    @Override
    public DishCategory getCategoryById(Long id) {
        return dishCategoryMapper.selectById(id);
    }

    @Override
    public void createCategory(DishCategory category) {
        dishCategoryMapper.insert(category);
    }

    @Override
    public void updateCategory(DishCategory category) {
        dishCategoryMapper.updateById(category);
    }

    @Override
    public void deleteCategory(Long id) {
        DishCategory category = new DishCategory();
        category.setId(id);
        category.setDeleted(1);
        dishCategoryMapper.updateById(category);
    }
}
