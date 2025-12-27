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
    error: false,
    
    // 菜品定制选项
    quantity: 1,
    selectedTaste: '不辣', // 默认口味
    selectedSize: '中份', // 默认份量
    selectedExtras: [], // 选中的加料
    totalPrice: 0, // 总价
    
    // 可选项列表
    tasteOptions: [
      { value: '不辣', label: '不辣' },
      { value: '微辣', label: '微辣' },
      { value: '中辣', label: '中辣' },
      { value: '特辣', label: '特辣' }
    ],
    sizeOptions: [
      { value: '小份', label: '小份', price: -5 },
      { value: '中份', label: '中份', price: 0 },
      { value: '大份', label: '大份', price: 5 }
    ],
    extraOptions: [
      { id: 'extra1', name: '加辣椒', price: 2 },
      { id: 'extra2', name: '加葱花', price: 1 },
      { id: 'extra3', name: '加香菜', price: 1 },
      { id: 'extra4', name: '加蒜', price: 1 }
    ]
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
      this.updateTotalPrice(); // 初始化总价
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

  // 数量减少
  decreaseQuantity() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 });
      this.updateTotalPrice();
    }
  },

  // 数量增加
  increaseQuantity() {
    this.setData({ quantity: this.data.quantity + 1 });
    this.updateTotalPrice();
  },

  // 选择口味
  selectTaste(e) {
    const taste = e.currentTarget.dataset.value;
    this.setData({ selectedTaste: taste });
  },

  // 选择份量
  selectSize(e) {
    const size = e.currentTarget.dataset.value;
    this.setData({ selectedSize: size });
    this.updateTotalPrice();
  },

  // 切换加料
  toggleExtra(e) {
    console.log('[toggleExtra] 被点击', e);
    const extraId = e.currentTarget.dataset.id;
    console.log('[toggleExtra] extraId:', extraId);
    
    const extras = this.data.selectedExtras.slice();
    const index = extras.indexOf(extraId);
    
    if (index > -1) {
      extras.splice(index, 1);
      console.log('[toggleExtra] 移除加料:', extraId);
    } else {
      extras.push(extraId);
      console.log('[toggleExtra] 添加加料:', extraId);
    }
    
    console.log('[toggleExtra] 更新后的 extras:', extras);
    this.setData({ selectedExtras: extras });
    this.updateTotalPrice();
  },

  // 更新总价
  updateTotalPrice() {
    const totalPrice = this.calculateTotalPrice();
    this.setData({ totalPrice });
  },

  // 计算总价
  calculateTotalPrice() {
    let total = this.data.dish.price || 0;
    
    // 加上份量价格
    const sizeOption = this.data.sizeOptions.find(s => s.value === this.data.selectedSize);
    if (sizeOption) {
      total += sizeOption.price;
    }
    
    // 加上加料价格
    this.data.selectedExtras.forEach(extraId => {
      const extra = this.data.extraOptions.find(e => e.id === extraId);
      if (extra) {
        total += extra.price;
      }
    });
    
    // 乘以数量
    return (total * this.data.quantity).toFixed(2);
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
    
    // 构建菜品信息（包含定制选项）
    const cartItem = {
      ...this.data.dish,
      quantity: this.data.quantity,
      customize: {
        taste: this.data.selectedTaste,
        size: this.data.selectedSize,
        extras: this.data.selectedExtras.map(id => {
          const extra = this.data.extraOptions.find(e => e.id === id);
          return extra ? extra.name : '';
        }).filter(Boolean)
      },
      customPrice: parseFloat(this.calculateTotalPrice()) / this.data.quantity
    };
    
    // 直接添加（包含定制选项的菜品视为不同的商品）
    cart.push(cartItem);
    
    // 保存到本地存储
    wx.setStorageSync('cart', cart);
    
    wx.showToast({ 
      title: '已加入购物车', 
      icon: 'success',
      duration: 1500
    });
    
    // 重置选项
    this.setData({
      quantity: 1,
      selectedTaste: '不辣',
      selectedSize: '中份',
      selectedExtras: []
    });
  },

  // 立即购买
  buyNow() {
    if (!this.checkLogin()) return;
    
    if (this.data.dish.status !== 1) {
      wx.showToast({ title: '该菜品已售罄', icon: 'none' });
      return;
    }

    // 创建订单数据（包含定制选项）
    const orderData = {
      items: [{
        ...this.data.dish,
        quantity: this.data.quantity,
        customize: {
          taste: this.data.selectedTaste,
          size: this.data.selectedSize,
          extras: this.data.selectedExtras.map(id => {
            const extra = this.data.extraOptions.find(e => e.id === id);
            return extra ? extra.name : '';
          }).filter(Boolean)
        },
        customPrice: parseFloat(this.calculateTotalPrice()) / this.data.quantity
      }],
      totalPrice: this.calculateTotalPrice()
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