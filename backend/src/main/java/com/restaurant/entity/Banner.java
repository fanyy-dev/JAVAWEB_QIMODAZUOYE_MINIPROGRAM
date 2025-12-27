package com.restaurant.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 广告/Banner实体
 */
@Data
@TableName("banner")
public class Banner {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 广告标题
     */
    private String title;
    
    /**
     * 图片URL
     */
    @TableField("image")
    private String imageUrl;
    
    /**
     * 跳转链接
     */
    @TableField("link")
    private String linkUrl;
    
    /**
     * 展示位置：HOME-首页, STORE-门店
     */
    private String position;
    
    /**
     * 排序
     */
    @TableField("sort_order")
    private Integer sort;
    
    /**
     * 状态：0-禁用 1-启用
     */
    private Integer status;
    
    /**
     * 开始时间
     */
    private LocalDateTime startTime;
    
    /**
     * 结束时间
     */
    private LocalDateTime endTime;
    
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
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
