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

Page({
  data: {
    dish: {},
    loading: true,
    error: false
  },

  onLoad(options) {
    this.dishId = options.id;
    this.loadDishDetail();
  },

  // 加载菜品详情
  loadDishDetail() {
    if (!this.dishId) {
      wx.showToast({ title: '参数错误', icon: 'error' });
      return;
    }

    this.setData({ loading: true, error: false });
    
    app.request({
      url: `/dish/${this.dishId}`,
      method: 'GET'
    }).then(data => {
      // 处理图片URL，使用本地图片，确保使用传递过来的dishId
      const imageName = dishImageMap[this.dishId];
      const processedDish = {
        ...data,
        image: imageName ? `/images/dishes/${imageName}` : '/images/common/icon_search.png'
      };
      this.setData({ dish: processedDish, loading: false });
    }).catch(err => {
      console.error('加载菜品详情失败', err);
      // 即使网络请求失败，也使用本地数据显示基本信息
      const imageName = dishImageMap[this.dishId];
      // 使用与WXML一致的字段名
      const mockDish = {
        id: this.dishId,
        dishName: '菜品',
        price: 0,
        description: '暂无描述',
        image: imageName ? `/images/dishes/${imageName}` : '/images/common/icon_search.png',
        rating: 0,
        saleCount: 0,
        categoryName: '未分类',
        status: 1
      };
      this.setData({ dish: mockDish, loading: false, error: true });
      wx.showToast({ title: '加载失败，显示本地数据', icon: 'none' });
    });
  },

  // 重新加载
  onRetry() {
    this.loadDishDetail();
  },

  // 检查登录状态
  checkLogin() {
    const app = getApp();
    if (!app.globalData.token) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/auth/login/login' });
          }
        }
      });
      return false;
    }
    return true;
  },

  // 加入购物车
  addToCart() {
    if (!this.checkLogin()) return;
    
    if (this.data.dish.status !== 1) {
      wx.showToast({ title: '该菜品已售罄', icon: 'none' });
      return;
    }

    // 获取本地购物车数据
    let cart = wx.getStorageSync('cart') || [];
    
    // 检查是否已存在该菜品
    const existingIndex = cart.findIndex(item => item.id === this.dishId);
    
    if (existingIndex >= 0) {
      // 已存在，数量+1
      cart[existingIndex].quantity += 1;
    } else {
      // 不存在，添加新条目
      cart.push({
        ...this.data.dish,
        quantity: 1
      });
    }
    
    // 保存到本地存储
    wx.setStorageSync('cart', cart);
    
    wx.showToast({ 
      title: '已加入购物车', 
      icon: 'success',
      duration: 1500
    });
  },

  // 立即购买
  buyNow() {
    if (!this.checkLogin()) return;
    
    if (this.data.dish.status !== 1) {
      wx.showToast({ title: '该菜品已售罄', icon: 'none' });
      return;
    }

    // 创建订单数据
    const orderData = {
      items: [{
        ...this.data.dish,
        quantity: 1
      }],
      totalPrice: this.data.dish.price
    };
    
    // 保存订单数据到本地，用于跳转到订单确认页
    wx.setStorageSync('pendingOrder', orderData);
    
    // 跳转到订单确认页
    wx.navigateTo({
      url: '/pages/orders/confirm/confirm'
    });
  },

  // 跳转到购物车
  goToCart() {
    wx.switchTab({
      url: '/pages/cart/list/list'
    });
  },

  // 返回上一页
  onBackTap() {
    wx.navigateBack();
  }
});