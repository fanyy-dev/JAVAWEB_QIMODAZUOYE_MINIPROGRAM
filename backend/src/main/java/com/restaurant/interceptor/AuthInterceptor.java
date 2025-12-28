package com.restaurant.interceptor;

import com.alibaba.fastjson2.JSON;
import com.restaurant.common.Result;
import com.restaurant.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 认证拦截器
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // OPTIONS请求直接放行
        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }

        // 获取请求路径
        String requestPath = request.getRequestURI();
        System.out.println("[AuthInterceptor] 请求路径: " + requestPath);
        
        // 排除登录相关接口和公开接口
        if (requestPath.contains("/auth/login") || 
            requestPath.contains("/auth/register") || 
            requestPath.contains("/auth/sendCode") ||
            requestPath.contains("/store/") || // 添加门店接口（包含门店详情）
            requestPath.contains("/dish/") || // 添加菜品接口（包含菜品详情）
            requestPath.contains("/dish/recommend") ||
            requestPath.contains("/dish/new") ||
            requestPath.contains("/dish/top-sales") ||
            requestPath.contains("/dish-category/") || // 添加分类详情接口
            requestPath.contains("/error")) {
            System.out.println("[AuthInterceptor] 路径在排除列表中，直接放行");
            return true;
        }

        // 获取token
        String token = request.getHeader("Authorization");
        System.out.println("[AuthInterceptor] Authorization header: " + token);
        
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            System.out.println("[AuthInterceptor] 解析后的 token: " + token.substring(0, Math.min(20, token.length())) + "...");
        }

        // 验证token
        if (token == null || !jwtUtil.validateToken(token)) {
            System.out.println("[AuthInterceptor] token验证失败，返回401");
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write( JSON.toJSONString(Result.error(401, "未登录或登录已过期")));
            return false;
        }

        // 将用户信息存入request
        Long userId = jwtUtil.getUserIdFromToken(token);
        String userType = jwtUtil.getUserTypeFromToken(token);
        System.out.println("[AuthInterceptor] 验证成功 - userId: " + userId + ", userType: " + userType);
        request.setAttribute("userId", userId);
        request.setAttribute("userType", userType);

        return true;    
    }
}
