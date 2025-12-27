package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.entity.Orders;
import com.restaurant.entity.Review;
import com.restaurant.entity.Store;
import com.restaurant.entity.User;
import com.restaurant.mapper.OrdersMapper;
import com.restaurant.mapper.ReviewMapper;
import com.restaurant.mapper.StoreMapper;
import com.restaurant.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewMapper reviewMapper;
    
    @Autowired
    private OrdersMapper ordersMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private StoreMapper storeMapper;

    public Page<Review> getPage(Integer pageNum, Integer pageSize, String orderNo, Integer rating) {
        Page<Review> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        if (rating != null) {
            wrapper.eq(Review::getRating, rating.doubleValue());
        }
        wrapper.orderByDesc(Review::getCreateTime);
        Page<Review> result = reviewMapper.selectPage(page, wrapper);
        
        // 填充关联数据
        for (Review review : result.getRecords()) {
            fillRelatedData(review);
            // 根据订单号过滤
            if (StringUtils.hasText(orderNo) && review.getOrderNo() != null && !review.getOrderNo().contains(orderNo)) {
                continue;
            }
        }
        return result;
    }
    
    private void fillRelatedData(Review review) {
        if (review.getOrderId() != null) {
            Orders order = ordersMapper.selectById(review.getOrderId());
            if (order != null) {
                review.setOrderNo(order.getOrderNo());
            }
        }
        if (review.getUserId() != null) {
            User user = userMapper.selectById(review.getUserId());
            if (user != null) {
                review.setUsername(review.getAnonymous() != null && review.getAnonymous() == 1 ? "匿名用户" : user.getNickname());
            }
        }
        if (review.getStoreId() != null) {
            Store store = storeMapper.selectById(review.getStoreId());
            if (store != null) {
                review.setStoreName(store.getStoreName());
            }
        }
    }

    public List<Review> getByStoreId(Long storeId) {
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Review::getStoreId, storeId)
               .orderByDesc(Review::getCreateTime);
        List<Review> reviews = reviewMapper.selectList(wrapper);
        reviews.forEach(this::fillRelatedData);
        return reviews;
    }

    public List<Review> getByUserId(Long userId) {
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Review::getUserId, userId)
               .orderByDesc(Review::getCreateTime);
        List<Review> reviews = reviewMapper.selectList(wrapper);
        reviews.forEach(this::fillRelatedData);
        return reviews;
    }

    public Review getByOrderId(Long orderId) {
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Review::getOrderId, orderId);
        Review review = reviewMapper.selectOne(wrapper);
        if (review != null) {
            fillRelatedData(review);
        }
        return review;
    }

    public Review getById(Long id) {
        Review review = reviewMapper.selectById(id);
        if (review != null) {
            fillRelatedData(review);
        }
        return review;
    }

    public void save(Review review) {
        // 计算综合评分
        if (review.getTasteRating() != null && review.getServiceRating() != null && review.getEnvironmentRating() != null) {
            double avg = (review.getTasteRating() + review.getServiceRating() + review.getEnvironmentRating()) / 3.0;
            review.setRating(Math.round(avg * 10) / 10.0);
        }
        reviewMapper.insert(review);
    }

    public void delete(Long id) {
        reviewMapper.deleteById(id);
    }

    public Double getAverageRatingByStoreId(Long storeId) {
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Review::getStoreId, storeId);
        List<Review> reviews = reviewMapper.selectList(wrapper);
        if (reviews.isEmpty()) {
            return 5.0;
        }
        return reviews.stream().mapToDouble(Review::getRating).average().orElse(5.0);
    }
}
