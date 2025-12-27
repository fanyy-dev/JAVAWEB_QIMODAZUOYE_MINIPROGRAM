package com.restaurant.controller;

import com.restaurant.common.Result;
import com.restaurant.entity.ShoppingCart;
import com.restaurant.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * 购物车控制器
 */
@RestController
@RequestMapping("/cart")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    /**
     * 添加到购物车
     */
    @PostMapping("/add")
    public Result<String> addToCart(@RequestBody ShoppingCart cart, HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            cart.setUserId(userId);
            shoppingCartService.addToCart(cart);
            return Result.success("添加成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新数量
     */
    @PutMapping("/{id}/quantity")
    public Result<String> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        try {
            shoppingCartService.updateQuantity(id, quantity);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 删除购物车项
     */
    @DeleteMapping("/{id}")
    public Result<String> removeFromCart(@PathVariable Long id) {
        try {
            shoppingCartService.removeFromCart(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 清空购物车
     */
    @DeleteMapping("/clear")
    public Result<String> clearCart(HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            shoppingCartService.clearCart(userId);
            return Result.success("清空成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取购物车列表
     */
    @GetMapping("/list")
    public Result<List<Map<String, Object>>> getCartList(HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            List<Map<String, Object>> list = shoppingCartService.getCartList(userId);
            return Result.success(list);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
