package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.dto.CreateOrderRequest;
import com.restaurant.entity.OrderItem;
import com.restaurant.entity.Orders;
import com.restaurant.mapper.OrderItemMapper;
import com.restaurant.mapper.OrdersMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;

/**
 * 订单服务
 */
@Service
public class OrderService {

    @Autowired
    private OrdersMapper ordersMapper;

    @Autowired
    private OrderItemMapper orderItemMapper;

    /**
     * 创建订单
     */
    @Transactional(rollbackFor = Exception.class)
    public Orders createOrder(Long userId, CreateOrderRequest request) {
        // 生成订单号
        String orderNo = generateOrderNo();

        // 使用前端传入的金额，如果不存在则计算
        BigDecimal totalAmount = request.getTotalAmount();
        BigDecimal deliveryFee = request.getDeliveryFee();
        BigDecimal actualAmount = request.getActualAmount();
        
        // 获取订单项（兼容items和orderItems）
        List<CreateOrderRequest.OrderItemDto> items = request.getOrderItems();
        
        if (totalAmount == null) {
            totalAmount = BigDecimal.ZERO;
            for (CreateOrderRequest.OrderItemDto item : items) {
                BigDecimal subtotal = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
                totalAmount = totalAmount.add(subtotal);
            }
        }
        
        if (deliveryFee == null) {
            deliveryFee = BigDecimal.ZERO;
            if ("TAKEOUT".equals(request.getOrderType())) {
                deliveryFee = new BigDecimal("5.00");
            }
        }
        
        if (actualAmount == null) {
            BigDecimal discountAmount = BigDecimal.ZERO;
            actualAmount = totalAmount.subtract(discountAmount).add(deliveryFee);
        }

        // 创建订单
        Orders order = new Orders();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setStoreId(request.getStoreId());
        order.setOrderType(request.getOrderType());
        order.setTableId(request.getTableId());
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setDeliveryFee(deliveryFee);
        order.setActualAmount(actualAmount);
        order.setPayStatus("UNPAID");
        order.setOrderStatus("PENDING");
        order.setContactName(request.getContactName());
        order.setContactPhone(request.getContactPhone());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setRemark(request.getRemark());

        ordersMapper.insert(order);

        // 创建订单明细
        for (CreateOrderRequest.OrderItemDto itemDto : items) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setItemType(itemDto.getItemType());
            orderItem.setItemId(itemDto.getItemId());
            orderItem.setItemName(itemDto.getItemName());
            orderItem.setItemImage(itemDto.getItemImage());
            orderItem.setPrice(itemDto.getPrice());
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setSpec(itemDto.getSpec());
            orderItem.setSubtotal(itemDto.getPrice().multiply(new BigDecimal(itemDto.getQuantity())));
            orderItemMapper.insert(orderItem);
        }

        return order;
    }

    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        return "ORD" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + 
               String.format("%04d", (int)(Math.random() * 10000));
    }

    /**
     * 获取用户订单列表
     */
    public Page<Orders> getUserOrders(Long userId, Integer pageNum, Integer pageSize, String status) {
        Page<Orders> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Orders::getUserId, userId);
        
        if (status != null && !status.isEmpty()) {
            wrapper.eq(Orders::getOrderStatus, status);
        }
        
        wrapper.orderByDesc(Orders::getCreateTime);
        return ordersMapper.selectPage(page, wrapper);
    }

    /**
     * 获取订单详情
     */
    public Orders getOrderById(Long orderId) {
        return ordersMapper.selectById(orderId);
    }

    /**
     * 获取订单明细
     */
    public List<OrderItem> getOrderItems(Long orderId) {
        LambdaQueryWrapper<OrderItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OrderItem::getOrderId, orderId);
        return orderItemMapper.selectList(wrapper);
    }

    /**
     * 更新订单状态
     */
    public void updateOrderStatus(Long orderId, String status) {
        Orders order = new Orders();
        order.setId(orderId);
        order.setOrderStatus(status);
        ordersMapper.updateById(order);
    }

    /**
     * 取消订单
     */
    public void cancelOrder(Long orderId, String reason) {
        Orders order = new Orders();
        order.setId(orderId);
        order.setOrderStatus("CANCELLED");
        order.setCancelReason(reason);
        ordersMapper.updateById(order);
    }

    /**
     * 支付订单
     */
    public void payOrder(Long orderId, String payMethod) {
        Orders order = new Orders();
        order.setId(orderId);
        order.setPayStatus("PAID");
        order.setPayMethod(payMethod);
        order.setOrderStatus("ACCEPTED");
        ordersMapper.updateById(order);
    }

    /**
     * 获取门店订单列表
     */
    public Page<Orders> getStoreOrders(Long storeId, Integer pageNum, Integer pageSize, String status) {
        Page<Orders> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Orders::getStoreId, storeId);
        
        if (status != null && !status.isEmpty()) {
            wrapper.eq(Orders::getOrderStatus, status);
        }
        
        wrapper.orderByDesc(Orders::getCreateTime);
        return ordersMapper.selectPage(page, wrapper);
    }

    /**
     * 获取订单列表(管理端)
     */
    public Page<Orders> getOrderList(Integer pageNum, Integer pageSize, String orderNo, String orderStatus, String startDate, String endDate) {
        Page<Orders> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<>();
        
        if (orderNo != null && !orderNo.isEmpty()) {
            wrapper.eq(Orders::getOrderNo, orderNo);
        }
        
        if (orderStatus != null && !orderStatus.isEmpty()) {
            wrapper.eq(Orders::getOrderStatus, orderStatus);
        }
        
        if (startDate != null && !startDate.isEmpty()) {
            wrapper.ge(Orders::getCreateTime, LocalDate.parse(startDate).atStartOfDay());
        }
        
        if (endDate != null && !endDate.isEmpty()) {
            wrapper.le(Orders::getCreateTime, LocalDate.parse(endDate).atTime(23, 59, 59));
        }
        
        wrapper.eq(Orders::getDeleted, 0);
        wrapper.orderByDesc(Orders::getCreateTime);
        return ordersMapper.selectPage(page, wrapper);
    }

    /**
     * 今日订单数
     */
    public Long getTodayOrderCount() {
        LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<>();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        wrapper.between(Orders::getCreateTime, startOfDay, endOfDay);
        wrapper.eq(Orders::getDeleted, 0);
        return ordersMapper.selectCount(wrapper);
    }

    /**
     * 今日营业额
     */
    public Long getTodayOrderAmount() {
        LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<>();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        wrapper.between(Orders::getCreateTime, startOfDay, endOfDay);
        wrapper.eq(Orders::getDeleted, 0);
        wrapper.eq(Orders::getPayStatus, "PAID");
        List<Orders> orders = ordersMapper.selectList(wrapper);
        
        Long totalAmount = 0L;
        for (Orders order : orders) {
            if (order.getActualAmount() != null) {
                totalAmount += order.getActualAmount().longValue();
            }
        }
        return totalAmount;
    }

    /**
     * 今日各时段订单统计
     */
    public Map<String, Object> getTodayHourlyStats() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        
        LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<>();
        wrapper.between(Orders::getCreateTime, startOfDay, endOfDay);
        wrapper.eq(Orders::getDeleted, 0);
        List<Orders> todayOrders = ordersMapper.selectList(wrapper);
        
        // 初始化每个时段的订单数为0
        int[] hourlyCounts = new int[12];
        
        // 统计每个时段的订单数
        for (Orders order : todayOrders) {
            int hour = order.getCreateTime().getHour();
            int index = hour / 2; // 0-1时 -> 0, 2-3时 -> 1, ..., 22-23时 -> 11
            if (index < 12) {
                hourlyCounts[index]++;
            }
        }
        
        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            labels.add((i * 2) + "-" + (i * 2 + 2) + "时");
            data.add(hourlyCounts[i]);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("data", data);
        return result;
    }
}
