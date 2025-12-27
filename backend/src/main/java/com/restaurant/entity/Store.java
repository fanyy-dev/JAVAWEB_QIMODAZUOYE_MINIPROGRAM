package com.restaurant.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 门店实体类
 */
@TableName("store")
public class Store implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField(value = "store_name")
    private String storeName;

    @TableField(value = "store_type")
    private String storeType;

    private String phone;

    private String province;

    private String city;

    private String district;

    private String address;

    private BigDecimal latitude;

    private BigDecimal longitude;

    @TableField(value = "business_hours")
    private String businessHours;

    @TableField(value = "avg_price")
    private BigDecimal avgPrice;

    private String description;

    private String images;

    private String tags;

    private BigDecimal rating;

    @TableField(value = "sale_count")
    private Integer saleCount;

    @TableField(value = "total_seats")
    private Integer totalSeats;

    @TableField(value = "available_seats")
    private Integer availableSeats;

    private Integer status;

    @TableLogic
    private Integer deleted;

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }
    
    public String getStoreType() { return storeType; }
    public void setStoreType(String storeType) { this.storeType = storeType; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
    
    public String getBusinessHours() { return businessHours; }
    public void setBusinessHours(String businessHours) { this.businessHours = businessHours; }
    
    public BigDecimal getAvgPrice() { return avgPrice; }
    public void setAvgPrice(BigDecimal avgPrice) { this.avgPrice = avgPrice; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    
    public Integer getSaleCount() { return saleCount; }
    public void setSaleCount(Integer saleCount) { this.saleCount = saleCount; }
    
    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
    
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    
    public Integer getDeleted() { return deleted; }
    public void setDeleted(Integer deleted) { this.deleted = deleted; }
    
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
}