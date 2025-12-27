package com.restaurant.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 菜品实体类
 */
@TableName("dish")
public class Dish implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String dishName;

    @TableField(value = "category_id")
    private Long categoryId;

    @TableField(value = "store_id")
    private Long storeId;

    private BigDecimal price;

    private BigDecimal originalPrice;

    private String description;

    private String image;

    @TableField(value = "images")
    private String images;

    private String ingredients;

    @TableField(value = "spicy_level")
    private Integer spicyLevel;

    private String tags;

    @TableField(value = "is_new")
    private Integer isNew;

    @TableField(value = "is_recommend")
    private Integer isRecommend;

    @TableField(value = "monthly_sales")
    private Integer saleCount;

    private Integer stock;

    private BigDecimal rating;

    @TableField(value = "reviews_count")
    private Integer reviewsCount;

    private Integer status;

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    // 非数据库字段，用于前端显示
    @TableField(exist = false)
    private String categoryName;

    @TableField(exist = false)
    private String storeName;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDishName() { return dishName; }
    public void setDishName(String dishName) { this.dishName = dishName; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }
    
    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }
    
    public Integer getSpicyLevel() { return spicyLevel; }
    public void setSpicyLevel(Integer spicyLevel) { this.spicyLevel = spicyLevel; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    public Integer getIsNew() { return isNew; }
    public void setIsNew(Integer isNew) { this.isNew = isNew; }
    
    public Integer getIsRecommend() { return isRecommend; }
    public void setIsRecommend(Integer isRecommend) { this.isRecommend = isRecommend; }
    
    public Integer getSaleCount() { return saleCount; }
    public void setSaleCount(Integer saleCount) { this.saleCount = saleCount; }
    
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    
    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }
    
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    
    public Integer getDeleted() { return deleted; }
    public void setDeleted(Integer deleted) { this.deleted = deleted; }
    
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
    
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    
    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }
}