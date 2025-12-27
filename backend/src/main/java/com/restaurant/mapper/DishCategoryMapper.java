package com.restaurant.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.restaurant.entity.DishCategory;
import org.apache.ibatis.annotations.Mapper;

/**
 * 菜品分类Mapper接口
 */
@Mapper
public interface DishCategoryMapper extends BaseMapper<DishCategory> {
}
