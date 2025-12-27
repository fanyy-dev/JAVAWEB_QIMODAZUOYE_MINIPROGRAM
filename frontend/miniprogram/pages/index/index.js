// pages/index/index.js
const app = getApp();

// 菜品ID与图片文件名的映射关系
const dishImageMap = {
  1: 'gongbaojiding.jpg',
  2: 'fuqifeipian.jpg',
  3: 'shuizhuyu.jpg',
  4: 'lazijiding.jpg',
  5: 'mapodoufu.jpg',
  6: 'chashaorou.jpg',
  7: 'chiyouji.jpg',
  8: 'danchaofan.jpg',
  9: 'danta.jpg',
  10: 'dongguapaigutang.jpg',
  11: 'dongguayimitang.jpg',
  12: 'haidai paigutang.jpg',
  13: 'laomujitang.jpg',
  14: 'paiguanggua.jpg',
  15: 'ruzhu.jpg',
  16: 'shaguozhou.jpg',
  17: 'shaomai.jpg',
  18: 'mifan.jpg',
  19: 'xiajiao.jpg'
};

// 门店ID与图片文件名的映射关系
const storeImageMap = {
  1: 'restaurant_101.jpg',
  2: 'restaurant_102.jpg',
  3: 'restaurant_103.jpg'
};

Page({
  data: {
    
    categories: [
      { id: 1, name: '热菜', icon: '/images/dishes/gongbaojiding.jpg' },
      { id: 2, name: '凉菜', icon: '/images/dishes/fuqifeipian.jpg' },
      { id: 3, name: '主食', icon: '/images/dishes/danchaofan.jpg' },
      { id: 4, name: '酒水', icon: '/images/common/icon_search.png' },
      { id: 5, name: '汤品', icon: '/images/dishes/dongguapaigutang.jpg' },
      { id: 6, name: '小吃', icon: '/images/dishes/shaomai.jpg' },
      { id: 7, name: '甜点', icon: '/images/dishes/danta.jpg' },
      { id: 8, name: '饮品', icon: '/images/common/icon_cart.png' }
    ],
    specialOfferDishes: [], // 特价团菜品
    recommendDishes: [],    // 推荐菜品
    stores: []
  },

  onLoad() {
    // 设置特价团菜品数据
    this.setSpecialOfferDishes();
    // 设置推荐菜品数据
    this.setRecommendDishes();
    // 加载门店数据
    this.loadStores();
  },

  // 设置特价团菜品数据
  setSpecialOfferDishes() {
    const specialOfferDishes = [
      { 
        id: 17, 
        dishName: '烧卖', 
        price: 6, 
        originalPrice: 8, 
        saleCount: 267, 
        description: '粤式经典，料足馅香',
        image: '/images/dishes/shaomai.jpg'  // 烧卖图片
      },
      { 
        id: 19, 
        dishName: '虾饺', 
        price: 8, 
        originalPrice: 10, 
        saleCount: 189, 
        description: '粤式点心，鲜香可口',
        image: '/images/dishes/xiajiao.jpg'   // 虾饺图片
      },
      { 
        id: 11, 
        dishName: '冬瓜薏米汤', 
        price: 22, 
        originalPrice: 25, 
        saleCount: 156, 
        description: '清热利湿的佳品',
        image: '/images/dishes/dongguayimitang.jpg' // 冬瓜薏米汤图片
      },
      { 
        id: 9, 
        dishName: '蛋挞', 
        price: 4, 
        originalPrice: 5, 
        saleCount: 342, 
        description: '葡式风味，香甜酥脆',
        image: '/images/dishes/danta.jpg'     // 蛋挞图片
      }
    ];
    this.setData({ specialOfferDishes: specialOfferDishes });
  },

  // 设置推荐菜品数据
  setRecommendDishes() {
    const recommendDishes = [
      { 
        id: 1, 
        dishName: '宫保鸡丁', 
        price: 32, 
        originalPrice: 38, 
        saleCount: 523, 
        description: '经典川菜，色香味俱全',
        image: '/images/dishes/gongbaojiding.jpg'  // 宫保鸡丁图片
      },
      { 
        id: 2, 
        dishName: '夫妻肺片', 
        price: 28, 
        originalPrice: 32, 
        saleCount: 412, 
        description: '传统凉菜，麻辣鲜香',
        image: '/images/dishes/fuqifeipian.jpg'   // 夫妻肺片图片
      },
      { 
        id: 3, 
        dishName: '水煮鱼', 
        price: 68, 
        originalPrice: 78, 
        saleCount: 356, 
        description: '鲜嫩可口，麻辣开胃',
        image: '/images/dishes/shuizhuyu.jpg' // 水煮鱼图片
      },
      { 
        id: 4, 
        dishName: '辣子鸡丁', 
        price: 26, 
        originalPrice: 30, 
        saleCount: 298, 
        description: '外酥里嫩，辣而不燥',
        image: '/images/dishes/lazijiding.jpg'     // 辣子鸡丁图片
      }
    ];
    this.setData({ recommendDishes: recommendDishes });
  },

  // 加载推荐菜品（保留接口调用，用于后续扩展）
  loadRecommendDishes() {
    // 网络请求可能返回不稳定数据，保留接口调用但不更新页面数据
    app.request({
      url: '/dish/recommend',
      data: { limit: 6 }
    }).then(data => {
      console.log('推荐菜品数据:', data);
      // 不再直接使用网络数据更新页面，保持本地固定数据
    }).catch(err => {
      console.error('加载推荐菜品失败', err);
      // 请求失败时使用本地固定数据
    });
  },

  // 加载门店列表
  loadStores() {
    app.request({
      url: '/store/list',
      data: { pageNum: 1, pageSize: 5 }
    }).then(data => {
      console.log('门店数据:', data);
      // 添加严格的数据检查
      if (data && data.records && Array.isArray(data.records)) {
        const stores = data.records.map(store => {
          // 处理图片URL，使用本地图片
          const imageName = storeImageMap[store.id];
          return {
            ...store,
            images: imageName ? [`/images/stores/${imageName}`] : [`/images/common/icon_search.png`],
            tagList: store.tags ? store.tags.split(',') : []
          };
        });
        this.setData({ stores });
      } else {
        console.error('门店数据格式错误:', data);
        this.setData({ stores: [] });
      }
    }).catch(err => {
      console.error('加载门店列表失败', err);
      this.setData({ stores: [] });
    });
  },

  // 分类点击
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish/list/list?categoryId=${categoryId}`
    });
  },

  // 菜品点击
  onDishTap(e) {
    const dishId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish/detail/detail?id=${dishId}`
    });
  },

  // 门店点击
  onStoreTap(e) {
    const storeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/store/detail/detail?id=${storeId}`
    });
  },

  // 更多菜品
  onMoreDishTap() {
    wx.navigateTo({
      url: '/pages/dish/list/list'
    });
  },

  // 更多门店
  onMoreStoreTap() {
    wx.navigateTo({
      url: '/pages/store/list/list'
    });
  },

  // 设置 tabBar 选中状态
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
  }
});
