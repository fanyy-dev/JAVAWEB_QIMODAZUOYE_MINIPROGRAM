package com.restaurant.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.restaurant.entity.Store;
import org.apache.ibatis.annotations.Mapper;

/**
 * 门店Mapper接口
 */
@Mapper
public interface StoreMapper extends BaseMapper<Store> {
}
