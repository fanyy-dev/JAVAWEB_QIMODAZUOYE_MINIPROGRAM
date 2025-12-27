-- 饭店管理系统数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS restaurant_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE restaurant_db;

-- ==================== 用户中心模块 ====================

-- 用户表
CREATE TABLE `user` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) DEFAULT NULL COMMENT '用户名',
  `password` VARCHAR(100) DEFAULT NULL COMMENT '密码',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(200) DEFAULT NULL COMMENT '头像',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
  `wechat_openid` VARCHAR(100) DEFAULT NULL COMMENT '微信OpenID',
  `user_type` VARCHAR(20) DEFAULT 'USER' COMMENT '用户类型:USER-普通用户,ADMIN-管理员,STAFF-员工',
  `member_level` VARCHAR(20) DEFAULT 'NORMAL' COMMENT '会员等级:NORMAL-普通,SILVER-银卡,GOLD-金卡,DIAMOND-钻石',
  `growth_value` INT(11) DEFAULT 0 COMMENT '成长值',
  `points` INT(11) DEFAULT 0 COMMENT '积分',
  `balance` DECIMAL(10,2) DEFAULT 0.00 COMMENT '余额',
  `taste_preference` VARCHAR(500) DEFAULT NULL COMMENT '口味偏好(JSON)',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-禁用,1-正常',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记:0-未删除,1-已删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_wechat_openid` (`wechat_openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 收货地址表
CREATE TABLE `user_address` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `contact_name` VARCHAR(50) NOT NULL COMMENT '联系人姓名',
  `contact_phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `province` VARCHAR(50) NOT NULL COMMENT '省份',
  `city` VARCHAR(50) NOT NULL COMMENT '城市',
  `district` VARCHAR(50) NOT NULL COMMENT '区县',
  `detail_address` VARCHAR(200) NOT NULL COMMENT '详细地址',
  `address_type` VARCHAR(20) DEFAULT 'HOME' COMMENT '地址类型:HOME-家庭,COMPANY-公司',
  `is_default` TINYINT(1) DEFAULT 0 COMMENT '是否默认:0-否,1-是',
  `latitude` DECIMAL(10,6) DEFAULT NULL COMMENT '纬度',
  `longitude` DECIMAL(10,6) DEFAULT NULL COMMENT '经度',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户地址表';

-- 用户收藏表
CREATE TABLE `user_favorite` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(20) NOT NULL COMMENT '收藏类型:DISH-菜品,STORE-门店',
  `target_id` BIGINT(20) NOT NULL COMMENT '目标ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收藏表';

-- 浏览历史表
CREATE TABLE `user_browse_history` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '历史ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(20) NOT NULL COMMENT '类型:DISH-菜品,STORE-门店',
  `target_id` BIGINT(20) NOT NULL COMMENT '目标ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '浏览时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='浏览历史表';

-- ==================== 餐厅展示模块 ====================

-- 门店表
CREATE TABLE `store` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '门店ID',
  `store_name` VARCHAR(100) NOT NULL COMMENT '门店名称',
  `store_type` VARCHAR(50) DEFAULT NULL COMMENT '菜系类型',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `province` VARCHAR(50) NOT NULL COMMENT '省份',
  `city` VARCHAR(50) NOT NULL COMMENT '城市',
  `district` VARCHAR(50) NOT NULL COMMENT '区县',
  `address` VARCHAR(200) NOT NULL COMMENT '详细地址',
  `latitude` DECIMAL(10,6) DEFAULT NULL COMMENT '纬度',
  `longitude` DECIMAL(10,6) DEFAULT NULL COMMENT '经度',
  `business_hours` VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  `avg_price` DECIMAL(10,2) DEFAULT NULL COMMENT '人均消费',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '门店描述',
  `images` TEXT DEFAULT NULL COMMENT '环境图片(JSON数组)',
  `tags` VARCHAR(200) DEFAULT NULL COMMENT '特色标签',
  `rating` DECIMAL(3,1) DEFAULT 5.0 COMMENT '评分',
  `sale_count` INT(11) DEFAULT 0 COMMENT '销量',
  `total_seats` INT(11) DEFAULT 0 COMMENT '总座位数',
  `available_seats` INT(11) DEFAULT 0 COMMENT '可用座位数',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-停业,1-营业',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_city` (`city`),
  KEY `idx_rating` (`rating`),
  KEY `idx_sale_count` (`sale_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店表';

-- 菜品分类表
CREATE TABLE `dish_category` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `category_name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `parent_id` BIGINT(20) DEFAULT 0 COMMENT '父分类ID',
  `sort_order` INT(11) DEFAULT 0 COMMENT '排序',
  `icon` VARCHAR(200) DEFAULT NULL COMMENT '图标',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-禁用,1-启用',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品分类表';

-- 菜品表
CREATE TABLE `dish` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '菜品ID',
  `dish_name` VARCHAR(100) NOT NULL COMMENT '菜品名称',
  `category_id` BIGINT(20) NOT NULL COMMENT '分类ID',
  `store_id` BIGINT(20) DEFAULT 0 COMMENT '门店ID(0表示所有门店)',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `original_price` DECIMAL(10,2) DEFAULT NULL COMMENT '原价',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '描述',
  `image` VARCHAR(200) DEFAULT NULL COMMENT '图片',
  `images` TEXT DEFAULT NULL COMMENT '详情图片(JSON数组)',
  `ingredients` VARCHAR(500) DEFAULT NULL COMMENT '原料',
  `spicy_level` TINYINT(1) DEFAULT 0 COMMENT '辣度:0-不辣,1-微辣,2-中辣,3-特辣',
  `tags` VARCHAR(200) DEFAULT NULL COMMENT '标签',
  `is_new` TINYINT(1) DEFAULT 0 COMMENT '是否新品',
  `is_recommend` TINYINT(1) DEFAULT 0 COMMENT '是否推荐',
  `sale_count` INT(11) DEFAULT 0 COMMENT '销量',
  `stock` INT(11) DEFAULT 999 COMMENT '库存',
  `rating` DECIMAL(3,1) DEFAULT 5.0 COMMENT '评分',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-下架,1-上架',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_sale_count` (`sale_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';

-- 套餐表
CREATE TABLE `combo` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '套餐ID',
  `combo_name` VARCHAR(100) NOT NULL COMMENT '套餐名称',
  `store_id` BIGINT(20) DEFAULT 0 COMMENT '门店ID',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `original_price` DECIMAL(10,2) DEFAULT NULL COMMENT '原价',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '描述',
  `image` VARCHAR(200) DEFAULT NULL COMMENT '图片',
  `dish_items` TEXT DEFAULT NULL COMMENT '菜品项(JSON)',
  `sale_count` INT(11) DEFAULT 0 COMMENT '销量',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-下架,1-上架',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='套餐表';

-- ==================== 点餐预订模块 ====================

-- 购物车表
CREATE TABLE `shopping_cart` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `item_type` VARCHAR(20) NOT NULL COMMENT '商品类型:DISH-菜品,COMBO-套餐',
  `item_id` BIGINT(20) NOT NULL COMMENT '商品ID',
  `quantity` INT(11) DEFAULT 1 COMMENT '数量',
  `spec` VARCHAR(500) DEFAULT NULL COMMENT '规格(JSON)',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- 桌位表
CREATE TABLE `table_info` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '桌位ID',
  `store_id` BIGINT(20) NOT NULL COMMENT '门店ID',
  `table_number` VARCHAR(20) NOT NULL COMMENT '桌号',
  `table_type` VARCHAR(20) DEFAULT 'NORMAL' COMMENT '桌位类型:NORMAL-大厅,PRIVATE-包间',
  `seat_count` INT(11) DEFAULT 4 COMMENT '座位数',
  `min_price` DECIMAL(10,2) DEFAULT 0.00 COMMENT '最低消费',
  `status` VARCHAR(20) DEFAULT 'AVAILABLE' COMMENT '状态:AVAILABLE-空闲,OCCUPIED-使用中,RESERVED-已预订,CLEANING-清理中',
  `qr_code` VARCHAR(200) DEFAULT NULL COMMENT '二维码',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_store_id` (`store_id`),
  UNIQUE KEY `uk_store_table` (`store_id`, `table_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='桌位表';

-- 预订表
CREATE TABLE `reservation` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '预订ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `store_id` BIGINT(20) NOT NULL COMMENT '门店ID',
  `table_id` BIGINT(20) DEFAULT NULL COMMENT '桌位ID',
  `contact_name` VARCHAR(50) NOT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `people_count` INT(11) NOT NULL COMMENT '就餐人数',
  `reservation_time` DATETIME NOT NULL COMMENT '预订时间',
  `special_request` VARCHAR(500) DEFAULT NULL COMMENT '特殊需求',
  `status` VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态:PENDING-待确认,CONFIRMED-已确认,ARRIVED-已到店,COMPLETED-已完成,CANCELLED-已取消',
  `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_store_id` (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预订表';

-- ==================== 订单管理模块 ====================

-- 订单表
CREATE TABLE `orders` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单号',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `store_id` BIGINT(20) NOT NULL COMMENT '门店ID',
  `order_type` VARCHAR(20) NOT NULL COMMENT '订单类型:DINE_IN-堂食,TAKEOUT-外卖,RESERVE-预订',
  `table_id` BIGINT(20) DEFAULT NULL COMMENT '桌位ID',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总额',
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
  `delivery_fee` DECIMAL(10,2) DEFAULT 0.00 COMMENT '配送费',
  `actual_amount` DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  `pay_method` VARCHAR(20) DEFAULT NULL COMMENT '支付方式:WECHAT-微信,ALIPAY-支付宝,BALANCE-余额,CASH-现金',
  `pay_status` VARCHAR(20) DEFAULT 'UNPAID' COMMENT '支付状态:UNPAID-未支付,PAID-已支付,REFUNDED-已退款',
  `order_status` VARCHAR(20) DEFAULT 'PENDING' COMMENT '订单状态:PENDING-待接单,ACCEPTED-已接单,PREPARING-制作中,READY-待取餐,DELIVERING-配送中,COMPLETED-已完成,CANCELLED-已取消',
  `contact_name` VARCHAR(50) DEFAULT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `delivery_address` VARCHAR(500) DEFAULT NULL COMMENT '配送地址',
  `expected_time` DATETIME DEFAULT NULL COMMENT '期望送达时间',
  `actual_time` DATETIME DEFAULT NULL COMMENT '实际送达时间',
  `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
  `cancel_reason` VARCHAR(500) DEFAULT NULL COMMENT '取消原因',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 订单明细表
CREATE TABLE `order_item` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `order_id` BIGINT(20) NOT NULL COMMENT '订单ID',
  `item_type` VARCHAR(20) NOT NULL COMMENT '商品类型:DISH-菜品,COMBO-套餐',
  `item_id` BIGINT(20) NOT NULL COMMENT '商品ID',
  `item_name` VARCHAR(100) NOT NULL COMMENT '商品名称',
  `item_image` VARCHAR(200) DEFAULT NULL COMMENT '商品图片',
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `quantity` INT(11) NOT NULL COMMENT '数量',
  `spec` VARCHAR(500) DEFAULT NULL COMMENT '规格(JSON)',
  `subtotal` DECIMAL(10,2) NOT NULL COMMENT '小计',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

-- 订单评价表
CREATE TABLE `order_review` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `order_id` BIGINT(20) NOT NULL COMMENT '订单ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `store_id` BIGINT(20) NOT NULL COMMENT '门店ID',
  `taste_rating` TINYINT(1) DEFAULT 5 COMMENT '口味评分',
  `service_rating` TINYINT(1) DEFAULT 5 COMMENT '服务评分',
  `environment_rating` TINYINT(1) DEFAULT 5 COMMENT '环境评分',
  `overall_rating` DECIMAL(3,1) DEFAULT 5.0 COMMENT '综合评分',
  `content` VARCHAR(500) DEFAULT NULL COMMENT '评价内容',
  `images` TEXT DEFAULT NULL COMMENT '评价图片(JSON)',
  `is_anonymous` TINYINT(1) DEFAULT 0 COMMENT '是否匿名',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_store_id` (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单评价表';

-- ==================== 营销互动模块 ====================

-- 优惠券模板表
CREATE TABLE `coupon_template` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '模板ID',
  `coupon_name` VARCHAR(100) NOT NULL COMMENT '优惠券名称',
  `coupon_type` VARCHAR(20) NOT NULL COMMENT '类型:FULL_REDUCE-满减,DISCOUNT-折扣,CASH-代金券',
  `discount_value` DECIMAL(10,2) NOT NULL COMMENT '优惠值',
  `min_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '最低消费',
  `max_discount` DECIMAL(10,2) DEFAULT NULL COMMENT '最大优惠金额',
  `total_count` INT(11) DEFAULT 0 COMMENT '发放总量',
  `received_count` INT(11) DEFAULT 0 COMMENT '已领取数量',
  `valid_days` INT(11) DEFAULT 30 COMMENT '有效天数',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '使用说明',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-禁用,1-启用',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券模板表';

-- 用户优惠券表
CREATE TABLE `user_coupon` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '优惠券ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `template_id` BIGINT(20) NOT NULL COMMENT '模板ID',
  `coupon_code` VARCHAR(50) NOT NULL COMMENT '优惠券码',
  `status` VARCHAR(20) DEFAULT 'UNUSED' COMMENT '状态:UNUSED-未使用,USED-已使用,EXPIRED-已过期',
  `receive_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '领取时间',
  `use_time` DATETIME DEFAULT NULL COMMENT '使用时间',
  `expire_time` DATETIME NOT NULL COMMENT '过期时间',
  `order_id` BIGINT(20) DEFAULT NULL COMMENT '使用订单ID',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  UNIQUE KEY `uk_coupon_code` (`coupon_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';

-- 积分记录表
CREATE TABLE `points_record` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `points` INT(11) NOT NULL COMMENT '积分变化',
  `type` VARCHAR(20) NOT NULL COMMENT '类型:EARN-获得,CONSUME-消费,EXPIRE-过期',
  `source` VARCHAR(50) DEFAULT NULL COMMENT '来源',
  `order_id` BIGINT(20) DEFAULT NULL COMMENT '订单ID',
  `remark` VARCHAR(200) DEFAULT NULL COMMENT '备注',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';

-- 活动表
CREATE TABLE `activity` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `activity_name` VARCHAR(100) NOT NULL COMMENT '活动名称',
  `activity_type` VARCHAR(20) NOT NULL COMMENT '活动类型:FULL_REDUCE-满减,DISCOUNT-折扣,SPECIAL-特价',
  `start_time` DATETIME NOT NULL COMMENT '开始时间',
  `end_time` DATETIME NOT NULL COMMENT '结束时间',
  `rule` TEXT DEFAULT NULL COMMENT '活动规则(JSON)',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '活动描述',
  `image` VARCHAR(200) DEFAULT NULL COMMENT '活动图片',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-禁用,1-启用',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动表';

-- ==================== 后台管理模块 ====================

-- 员工表
CREATE TABLE `staff` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '员工ID',
  `staff_name` VARCHAR(50) NOT NULL COMMENT '员工姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `username` VARCHAR(50) NOT NULL COMMENT '登录账号',
  `password` VARCHAR(100) NOT NULL COMMENT '密码',
  `store_id` BIGINT(20) DEFAULT NULL COMMENT '所属门店',
  `role` VARCHAR(20) NOT NULL COMMENT '角色:ADMIN-管理员,MANAGER-店长,WAITER-服务员,CHEF-厨师,DELIVERY-配送员',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-离职,1-在职',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工表';

-- 消息表
CREATE TABLE `message` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
  `message_type` VARCHAR(20) NOT NULL COMMENT '消息类型:ORDER-订单,PROMOTION-促销,SYSTEM-系统',
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `content` VARCHAR(500) NOT NULL COMMENT '内容',
  `link` VARCHAR(200) DEFAULT NULL COMMENT '跳转链接',
  `is_read` TINYINT(1) DEFAULT 0 COMMENT '是否已读',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- 广告表
CREATE TABLE `banner` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '广告ID',
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `image` VARCHAR(200) NOT NULL COMMENT '图片',
  `link` VARCHAR(200) DEFAULT NULL COMMENT '跳转链接',
  `position` VARCHAR(20) DEFAULT 'HOME' COMMENT '位置:HOME-首页,STORE-门店',
  `sort_order` INT(11) DEFAULT 0 COMMENT '排序',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-禁用,1-启用',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='广告表';

-- ==================== 初始化数据 ====================

-- 插入管理员账号
INSERT INTO `user` (`id`, `username`, `password`, `nickname`, `phone`, `user_type`, `member_level`) VALUES
(1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '13800138000', 'ADMIN', 'DIAMOND');

-- 插入门店数据
INSERT INTO `store` (`store_name`, `store_type`, `phone`, `province`, `city`, `district`, `address`, `business_hours`, `avg_price`, `total_seats`, `available_seats`, `rating`) VALUES
('川香阁(旗舰店)', '川菜', '0755-88888888', '广东省', '深圳市', '南山区', '科技园南区深南大道9988号', '10:00-22:00', 88.00, 100, 80, 4.8),
('粤味轩(海岸城店)', '粤菜', '0755-66666666', '广东省', '深圳市', '南山区', '海岸城购物中心3F', '11:00-21:00', 128.00, 80, 60, 4.9);

-- 插入菜品分类
INSERT INTO `dish_category` (`category_name`, `parent_id`, `sort_order`) VALUES
('热菜', 0, 1),
('凉菜', 0, 2),
('主食', 0, 3),
('酒水', 0, 4),
('川菜', 1, 1),
('粤菜', 1, 2);

-- 插入示例菜品
INSERT INTO `dish` (`dish_name`, `category_id`, `store_id`, `price`, `description`, `spicy_level`, `sale_count`, `rating`) VALUES
('宫保鸡丁', 5, 1, 38.00, '经典川菜，鸡肉鲜嫩，花生香脆', 2, 1288, 4.8),
('麻婆豆腐', 5, 1, 28.00, '麻辣鲜香，豆腐嫩滑', 3, 980, 4.7),
('白灼虾', 6, 2, 88.00, '新鲜海虾，原汁原味', 0, 756, 4.9),
('清蒸鲈鱼', 6, 2, 68.00, '鱼肉鲜嫩，清淡可口', 0, 654, 4.8);
