package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.entity.CouponTemplate;
import com.restaurant.mapper.CouponTemplateMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class CouponTemplateService {

    @Autowired
    private CouponTemplateMapper couponTemplateMapper;

    public Page<CouponTemplate> getPage(Integer pageNum, Integer pageSize, String keyword, String couponType) {
        Page<CouponTemplate> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<CouponTemplate> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.like(CouponTemplate::getCouponName, keyword);
        }
        if (StringUtils.hasText(couponType)) {
            wrapper.eq(CouponTemplate::getCouponType, couponType);
        }
        wrapper.orderByDesc(CouponTemplate::getCreateTime);
        return couponTemplateMapper.selectPage(page, wrapper);
    }

    public List<CouponTemplate> getAvailableList() {
        LambdaQueryWrapper<CouponTemplate> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CouponTemplate::getStatus, 1)
               .orderByDesc(CouponTemplate::getCreateTime);
        return couponTemplateMapper.selectList(wrapper);
    }

    public CouponTemplate getById(Long id) {
        return couponTemplateMapper.selectById(id);
    }

    public void save(CouponTemplate coupon) {
        if (coupon.getReceivedCount() == null) {
            coupon.setReceivedCount(0);
        }
        couponTemplateMapper.insert(coupon);
    }

    public void update(CouponTemplate coupon) {
        couponTemplateMapper.updateById(coupon);
    }

    public void delete(Long id) {
        couponTemplateMapper.deleteById(id);
    }
}
