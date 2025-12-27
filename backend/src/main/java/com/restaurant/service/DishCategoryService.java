package com.restaurant.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.entity.DishCategory;

public interface DishCategoryService {
    Page<DishCategory> getCategoryList(Integer pageNum, Integer pageSize, Long storeId, String keyword);
    DishCategory getCategoryById(Long id);
    void createCategory(DishCategory category);
    void updateCategory(DishCategory category);
    void deleteCategory(Long id);
}
