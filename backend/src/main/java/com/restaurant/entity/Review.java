package com.restaurant.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 订单评价实体
 */
@Data
@TableName("order_review")
public class Review {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 订单ID
     */
    private Long orderId;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 门店ID
     */
    private Long storeId;
    
    /**
     * 口味评分
     */
    private Integer tasteRating;
    
    /**
     * 服务评分
     */
    private Integer serviceRating;
    
    /**
     * 环境评分
     */
    private Integer environmentRating;
    
    /**
     * 综合评分
     */
    @TableField("overall_rating")
    private Double rating;
    
    /**
     * 评价内容
     */
    private String content;
    
    /**
     * 评价图片（JSON数组）
     */
    private String images;
    
    /**
     * 是否匿名：0-否 1-是
     */
    @TableField("is_anonymous")
    private Integer anonymous;
    
    /**
     * 删除标记
     */
    @TableLogic
    private Integer deleted;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    // 非数据库字段，用于展示
    @TableField(exist = false)
    private String orderNo;
    
    @TableField(exist = false)
    private String username;
    
    @TableField(exist = false)
    private String storeName;
    
    @TableField(exist = false)
    private String reply;
}
