package com.restaurant.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.common.Result;
import com.restaurant.entity.Review;
import com.restaurant.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    /**
     * 分页查询评价列表
     */
    @GetMapping("/list")
    public Result<Page<Review>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) Integer rating) {
        return Result.success(reviewService.getPage(pageNum, pageSize, orderNo, rating));
    }

    /**
     * 获取门店评价列表
     */
    @GetMapping("/store/{storeId}")
    public Result<List<Review>> getByStoreId(@PathVariable Long storeId) {
        return Result.success(reviewService.getByStoreId(storeId));
    }

    /**
     * 获取用户评价列表
     */
    @GetMapping("/user/{userId}")
    public Result<List<Review>> getByUserId(@PathVariable Long userId) {
        return Result.success(reviewService.getByUserId(userId));
    }

    /**
     * 获取订单评价
     */
    @GetMapping("/order/{orderId}")
    public Result<Review> getByOrderId(@PathVariable Long orderId) {
        return Result.success(reviewService.getByOrderId(orderId));
    }

    /**
     * 提交评价（小程序用）
     */
    @PostMapping
    public Result<Void> save(@RequestBody Review review) {
        reviewService.save(review);
        return Result.success();
    }

    /**
     * 删除评价
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        reviewService.delete(id);
        return Result.success();
    }

    /**
     * 获取门店平均评分
     */
    @GetMapping("/store/{storeId}/average")
    public Result<Double> getAverageRating(@PathVariable Long storeId) {
        return Result.success(reviewService.getAverageRatingByStoreId(storeId));
    }
}
