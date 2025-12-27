package com.restaurant.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.restaurant.common.Result;
import com.restaurant.dto.CreateOrderRequest;
import com.restaurant.entity.OrderItem;
import com.restaurant.entity.Orders;
import com.restaurant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 订单控制器
 */
@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 创建订单
     */
    @PostMapping("/create")
    public Result<Orders> createOrder(@RequestBody CreateOrderRequest request, HttpServletRequest httpRequest) {
        try {
            Long userId = (Long) httpRequest.getAttribute("userId");
            Orders order = orderService.createOrder(userId, request);
            return Result.success(order);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取用户订单列表
     */
    @GetMapping("/myOrders")
    public Result<Page<Orders>> getMyOrders(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String status,
            HttpServletRequest httpRequest) {
        try {
            Long userId = (Long) httpRequest.getAttribute("userId");
            Page<Orders> page = orderService.getUserOrders(userId, pageNum, pageSize, status);
            return Result.success(page);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取订单详情
     */
    @GetMapping("/{id}")
    public Result<Orders> getOrderDetail(@PathVariable Long id) {
        try {
            Orders order = orderService.getOrderById(id);
            List<OrderItem> items = orderService.getOrderItems(id);
            
            // 将 items 设置到 order 对象中
            order.setOrderItems(items);
            
            return Result.success(order);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 取消订单
     */
    @PostMapping("/{id}/cancel")
    public Result<String> cancelOrder(@PathVariable Long id, @RequestBody(required = false) Map<String, String> params) {
        try {
            String reason = params != null ? params.get("reason") : "用户取消";
            orderService.cancelOrder(id, reason);
            return Result.success("订单已取消");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 支付订单
     */
    @PostMapping("/{id}/pay")
    public Result<String> payOrder(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        try {
            String payMethod = (String) params.get("payMethod");
            orderService.payOrder(id, payMethod);
            return Result.success("支付成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新订单状态
     */
    @PostMapping("/{id}/updateStatus")
    public Result<String> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            orderService.updateOrderStatus(id, status);
            return Result.success("状态更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取订单列表(管理端)
     */
    @GetMapping("/list")
    public Result<Page<Orders>> getOrderList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) String orderStatus,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            Page<Orders> page = orderService.getOrderList(pageNum, pageSize, orderNo, orderStatus, startDate, endDate);
            return Result.success(page);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新订单状态(PATCH)
     */
    @PatchMapping("/{id}/status")
    public Result<String> updateOrderStatusPatch(@PathVariable Long id, @RequestBody Orders order) {
        try {
            orderService.updateOrderStatus(id, order.getOrderStatus());
            return Result.success("状态更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 取消订单(PATCH)
     */
    @PatchMapping("/{id}/cancel")
    public Result<String> cancelOrderPatch(@PathVariable Long id, @RequestBody Orders order) {
        try {
            orderService.cancelOrder(id, order.getCancelReason());
            return Result.success("订单已取消");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 今日订单数
     */
    @GetMapping("/today-count")
    public Result<Long> getTodayOrderCount() {
        try {
            Long count = orderService.getTodayOrderCount();
            return Result.success(count);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 今日营业额
     */
    @GetMapping("/today-amount")
    public Result<Long> getTodayOrderAmount() {
        try {
            Long amount = orderService.getTodayOrderAmount();
            return Result.success(amount);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 今日各时段订单统计
     */
    @GetMapping("/today-hourly-stats")
    public Result<Map<String, Object>> getTodayHourlyStats() {
        try {
            Map<String, Object> stats = orderService.getTodayHourlyStats();
            return Result.success(stats);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
