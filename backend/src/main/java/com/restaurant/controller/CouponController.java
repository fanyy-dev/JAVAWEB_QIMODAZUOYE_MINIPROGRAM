package com.restaurant.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.common.Result;
import com.restaurant.entity.CouponTemplate;
import com.restaurant.service.CouponTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coupon")
public class CouponController {

    @Autowired
    private CouponTemplateService couponTemplateService;

    /**
     * 分页查询优惠券列表
     */
    @GetMapping("/list")
    public Result<Page<CouponTemplate>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String couponType) {
        return Result.success(couponTemplateService.getPage(pageNum, pageSize, keyword, couponType));
    }

    /**
     * 获取可领取的优惠券列表（小程序用）
     */
    @GetMapping("/available")
    public Result<List<CouponTemplate>> getAvailable() {
        return Result.success(couponTemplateService.getAvailableList());
    }

    /**
     * 获取优惠券详情
     */
    @GetMapping("/{id}")
    public Result<CouponTemplate> getById(@PathVariable Long id) {
        return Result.success(couponTemplateService.getById(id));
    }

    /**
     * 新增优惠券
     */
    @PostMapping
    public Result<Void> save(@RequestBody CouponTemplate coupon) {
        couponTemplateService.save(coupon);
        return Result.success();
    }

    /**
     * 修改优惠券
     */
    @PutMapping
    public Result<Void> update(@RequestBody CouponTemplate coupon) {
        couponTemplateService.update(coupon);
        return Result.success();
    }

    /**
     * 删除优惠券
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        couponTemplateService.delete(id);
        return Result.success();
    }
}
