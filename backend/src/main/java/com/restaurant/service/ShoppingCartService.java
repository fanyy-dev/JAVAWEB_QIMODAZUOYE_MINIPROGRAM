package com.restaurant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.restaurant.entity.Dish;
import com.restaurant.entity.ShoppingCart;
import com.restaurant.mapper.DishMapper;
import com.restaurant.mapper.ShoppingCartMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 购物车服务
 */
@Service
public class ShoppingCartService {

    @Autowired
    private ShoppingCartMapper shoppingCartMapper;

    @Autowired
    private DishMapper dishMapper;

    /**
     * 添加到购物车
     */
    public void addToCart(ShoppingCart cart) {
        // 检查是否已存在相同商品
        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, cart.getUserId())
                .eq(ShoppingCart::getItemType, cart.getItemType())
                .eq(ShoppingCart::getItemId, cart.getItemId());
        
        ShoppingCart existingCart = shoppingCartMapper.selectOne(wrapper);
        
        if (existingCart != null) {
            // 更新数量
            existingCart.setQuantity(existingCart.getQuantity() + cart.getQuantity());
            shoppingCartMapper.updateById(existingCart);
        } else {
            // 新增
            shoppingCartMapper.insert(cart);
        }
    }

    /**
     * 更新购物车数量
     */
    public void updateQuantity(Long id, Integer quantity) {
        if (quantity <= 0) {
            shoppingCartMapper.deleteById(id);
        } else {
            ShoppingCart cart = new ShoppingCart();
            cart.setId(id);
            cart.setQuantity(quantity);
            shoppingCartMapper.updateById(cart);
        }
    }

    /**
     * 删除购物车项
     */
    public void removeFromCart(Long id) {
        shoppingCartMapper.deleteById(id);
    }

    /**
     * 清空购物车
     */
    public void clearCart(Long userId) {
        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, userId);
        shoppingCartMapper.delete(wrapper);
    }

    /**
     * 获取购物车列表
     */
    public List<Map<String, Object>> getCartList(Long userId) {
        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, userId);
        List<ShoppingCart> carts = shoppingCartMapper.selectList(wrapper);
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (ShoppingCart cart : carts) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", cart.getId());
            item.put("itemType", cart.getItemType());
            item.put("quantity", cart.getQuantity());
            item.put("spec", cart.getSpec());
            
            // 查询商品详情
            if ("DISH".equals(cart.getItemType())) {
                Dish dish = dishMapper.selectById(cart.getItemId());
                if (dish != null) {
                    item.put("itemId", dish.getId());
                    item.put("itemName", dish.getDishName());
                    item.put("itemImage", dish.getImage());
                    item.put("price", dish.getPrice());
                }
            }
            // TODO: 处理套餐类型
            
            result.add(item);
        }
        
        return result;
    }
}
