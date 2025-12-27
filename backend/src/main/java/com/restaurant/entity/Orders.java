package com.restaurant.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单实体类
 */
@TableName("orders")
public class Orders implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderNo;

    @TableField(value = "user_id")
    private Long userId;

    @TableField(value = "store_id")
    private Long storeId;

    @TableField(value = "order_type")
    private String orderType;

    @TableField(value = "table_id")
    private Long tableId;

    @TableField(value = "total_amount")
    private BigDecimal totalAmount;

    @TableField(value = "discount_amount")
    private BigDecimal discountAmount;

    @TableField(value = "delivery_fee")
    private BigDecimal deliveryFee;

    @TableField(value = "actual_amount")
    private BigDecimal actualAmount;

    @TableField(value = "pay_method")
    private String payMethod;

    @TableField(value = "pay_status")
    private String payStatus;

    @TableField(value = "order_status")
    private String orderStatus;

    @TableField(value = "contact_name")
    private String contactName;

    @TableField(value = "contact_phone")
    private String contactPhone;

    @TableField(value = "delivery_address")
    private String deliveryAddress;

    @TableField(value = "expected_time")
    private LocalDateTime expectedTime;

    @TableField(value = "actual_time")
    private LocalDateTime actualTime;

    private String remark;

    @TableField(value = "cancel_reason")
    private String cancelReason;

    @TableLogic
    private Integer deleted;

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    // 订单明细列表（非数据库字段）
    @TableField(exist = false)
    private List<OrderItem> orderItems;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }
    
    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }
    
    public Long getTableId() { return tableId; }
    public void setTableId(Long tableId) { this.tableId = tableId; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    
    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }
    
    public BigDecimal getActualAmount() { return actualAmount; }
    public void setActualAmount(BigDecimal actualAmount) { this.actualAmount = actualAmount; }
    
    public String getPayMethod() { return payMethod; }
    public void setPayMethod(String payMethod) { this.payMethod = payMethod; }
    
    public String getPayStatus() { return payStatus; }
    public void setPayStatus(String payStatus) { this.payStatus = payStatus; }
    
    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
    
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    
    public LocalDateTime getExpectedTime() { return expectedTime; }
    public void setExpectedTime(LocalDateTime expectedTime) { this.expectedTime = expectedTime; }
    
    public LocalDateTime getActualTime() { return actualTime; }
    public void setActualTime(LocalDateTime actualTime) { this.actualTime = actualTime; }
    
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    
    public Integer getDeleted() { return deleted; }
    public void setDeleted(Integer deleted) { this.deleted = deleted; }
    
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
    
    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
}