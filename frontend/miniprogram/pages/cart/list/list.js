const app = getApp();

Page({
  data: {
    isLoggedIn: false,
    cartItems: [],
    isAllSelected: false,
    selectedCount: 0,
    totalPrice: 0,
    loading: true
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    // 设置 tabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    }
    
    this.checkLoginStatus();
    this.loadCartData();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = app.globalData.token;
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    
    this.setData({ 
      isLoggedIn: !!token && !!userInfo.id
    });
  },

  // 加载购物车数据
  loadCartData() {
    this.setData({ loading: true });
    
    // 从本地存储获取购物车数据
    let cart = wx.getStorageSync('cart') || [];
    
    // 确保每个商品都有selected字段
    cart = cart.map(item => ({
      ...item,
      selected: item.selected !== false // 默认选中
    }));
    
    this.setData({
      cartItems: cart,
      loading: false
    });
    
    // 计算统计信息
    this.calculateTotals();
  },

  // 计算总计信息
  calculateTotals() {
    const { cartItems } = this.data;
    let selectedCount = 0;
    let totalPrice = 0;
    let allSelected = true;

    cartItems.forEach(item => {
      if (item.selected) {
        selectedCount++;
        totalPrice += item.price * item.quantity;
      } else {
        allSelected = false;
      }
    });

    this.setData({
      selectedCount,
      totalPrice: totalPrice.toFixed(2),
      isAllSelected: allSelected && cartItems.length > 0
    });
  },

  // 切换单个商品选择状态
  toggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    const { cartItems } = this.data;
    
    const updatedItems = cartItems.map(item => {
      if (item.id == id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    
    this.setData({ cartItems: updatedItems });
    this.calculateTotals();
    this.saveCartData();
  },

  // 切换全选状态
  toggleSelectAll() {
    const { isAllSelected, cartItems } = this.data;
    const newSelectedState = !isAllSelected;
    
    const updatedItems = cartItems.map(item => ({
      ...item,
      selected: newSelectedState
    }));
    
    this.setData({ 
      cartItems: updatedItems,
      isAllSelected: newSelectedState
    });
    this.calculateTotals();
    this.saveCartData();
  },

  // 增加商品数量
  increaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const { cartItems } = this.data;
    
    const updatedItems = cartItems.map(item => {
      if (item.id == id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    
    this.setData({ cartItems: updatedItems });
    this.calculateTotals();
    this.saveCartData();
  },

  // 减少商品数量
  decreaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const { cartItems } = this.data;
    
    const updatedItems = cartItems.map(item => {
      if (item.id == id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    
    this.setData({ cartItems: updatedItems });
    this.calculateTotals();
    this.saveCartData();
  },

  // 删除商品
  removeItem(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          const { cartItems } = this.data;
          const updatedItems = cartItems.filter(item => item.id != id);
          
          this.setData({ cartItems: updatedItems });
          this.calculateTotals();
          this.saveCartData();
          
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // 清空购物车
  clearCart() {
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ 
            cartItems: [],
            selectedCount: 0,
            totalPrice: 0,
            isAllSelected: false
          });
          wx.setStorageSync('cart', []);
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  },

  // 保存购物车数据到本地
  saveCartData() {
    const { cartItems } = this.data;
    wx.setStorageSync('cart', cartItems);
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  },

  // 去逛逛
  goShopping() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 结算
  checkout() {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            this.goToLogin();
          }
        }
      });
      return;
    }

    if (this.data.selectedCount === 0) {
      wx.showToast({ title: '请选择要结算的商品', icon: 'none' });
      return;
    }

    // 准备订单数据
    const selectedItems = this.data.cartItems.filter(item => item.selected);
    const orderData = {
      items: selectedItems,
      totalPrice: this.data.totalPrice,
      itemCount: this.data.selectedCount,
      source: 'cart'
    };

    // 保存订单数据，跳转到确认页面
    wx.setStorageSync('pendingOrder', orderData);
    
    wx.navigateTo({
      url: '/pages/orders/confirm/confirm',
      fail: () => {
        // 如果确认页面不存在，创建模拟订单
        this.createMockOrder(selectedItems);
      }
    });
  },

  // 创建模拟订单（当确认页面不存在时）
  createMockOrder(items) {
    const mockOrder = {
      id: Date.now(),
      orderNo: 'ORD' + Date.now(),
      items: items,
      totalPrice: this.data.totalPrice,
      status: 1,
      createTime: new Date().toLocaleString(),
      payMethod: 'wechat',
      address: null,
      remark: ''
    };

    wx.showModal({
      title: '订单创建成功',
      content: `订单号：${mockOrder.orderNo}\n总额：¥${this.data.totalPrice}`,
      showCancel: false,
      success: () => {
        // 清空购物车
        this.clearCart();
        
        // 跳转到订单列表
        wx.navigateTo({
          url: '/pages/orders/list/list'
        });
      }
    });
  }
});