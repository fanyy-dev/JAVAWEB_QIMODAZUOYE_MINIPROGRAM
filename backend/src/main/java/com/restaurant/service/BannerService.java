package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.restaurant.entity.Banner;
import com.restaurant.mapper.BannerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BannerService {

    @Autowired
    private BannerMapper bannerMapper;

    public List<Banner> getList() {
        LambdaQueryWrapper<Banner> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Banner::getSort);
        return bannerMapper.selectList(wrapper);
    }

    public List<Banner> getListByPosition(String position) {
        LambdaQueryWrapper<Banner> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Banner::getPosition, position)
               .eq(Banner::getStatus, 1)
               .orderByAsc(Banner::getSort);
        return bannerMapper.selectList(wrapper);
    }

    public Banner getById(Long id) {
        return bannerMapper.selectById(id);
    }

    public void save(Banner banner) {
        bannerMapper.insert(banner);
    }

    public void update(Banner banner) {
        bannerMapper.updateById(banner);
    }

    public void delete(Long id) {
        bannerMapper.deleteById(id);
    }
}
