package com.restaurant.controller;

import com.restaurant.common.Result;
import com.restaurant.entity.Banner;
import com.restaurant.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/banner")
public class BannerController {

    @Autowired
    private BannerService bannerService;

    /**
     * 获取所有广告列表
     */
    @GetMapping("/list")
    public Result<List<Banner>> list() {
        return Result.success(bannerService.getList());
    }

    /**
     * 根据位置获取广告（小程序用）
     */
    @GetMapping("/position/{position}")
    public Result<List<Banner>> getByPosition(@PathVariable String position) {
        return Result.success(bannerService.getListByPosition(position));
    }

    /**
     * 获取首页轮播图（小程序用）
     */
    @GetMapping("/home")
    public Result<List<Banner>> getHomeBanners() {
        return Result.success(bannerService.getListByPosition("HOME_BANNER"));
    }

    /**
     * 获取广告详情
     */
    @GetMapping("/{id}")
    public Result<Banner> getById(@PathVariable Long id) {
        return Result.success(bannerService.getById(id));
    }

    /**
     * 新增广告
     */
    @PostMapping
    public Result<Void> save(@RequestBody Banner banner) {
        bannerService.save(banner);
        return Result.success();
    }

    /**
     * 修改广告
     */
    @PutMapping
    public Result<Void> update(@RequestBody Banner banner) {
        bannerService.update(banner);
        return Result.success();
    }

    /**
     * 删除广告
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        bannerService.delete(id);
        return Result.success();
    }
}
