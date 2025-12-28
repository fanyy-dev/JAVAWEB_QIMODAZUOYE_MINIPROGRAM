-- 用户地址表建表语句
-- 如果表已存在，先删除
DROP TABLE IF EXISTS `user_address`;

-- 创建用户地址表
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

-- 插入测试数据（可选）
INSERT INTO `user_address` (`user_id`, `contact_name`, `contact_phone`, `province`, `city`, `district`, `detail_address`, `is_default`) 
VALUES 
(2, '张三', '13800138000', '北京市', '北京市', '朝阳区', '建国路88号现代城A座1001室', 1),
(2, '李四', '13900139000', '上海市', '上海市', '浦东新区', '陆家嘴金融中心25楼', 0);
