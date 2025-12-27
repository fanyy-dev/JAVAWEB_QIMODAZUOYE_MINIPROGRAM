package com.restaurant;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 饭店管理系统启动类
 */
@SpringBootApplication
@MapperScan("com.restaurant.mapper")
public class RestaurantApplication {

    public static void main(String[] args) {
        System.setProperty("spring.beaninfo.ignore", "true");
        SpringApplication.run(RestaurantApplication.class, args);
        System.out.println("\n===========================================");
        System.out.println("饭店管理系统启动成功！");
        System.out.println("接口文档地址: http://localhost:8080");
        System.out.println("===========================================\n");
    }
}
