package com.restaurant.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单明细实体类
 */
@TableName("order_item")
public class OrderItem implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long orderId;

    private String itemType;

    private Long itemId;

    private String itemName;

    private String itemImage;

    private BigDecimal price;

    private Integer quantity;

    private String spec;

    private BigDecimal subtotal;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    
    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }
    
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    
    public String getItemImage() { return itemImage; }
    public void setItemImage(String itemImage) { this.itemImage = itemImage; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getSpec() { return spec; }
    public void setSpec(String spec) { this.spec = spec; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
}