const app = getApp();

Page({
  data: {
    userInfo: {},
    isLoggedIn: false,
    isGuestMode: false,
    memberLevelText: '普通会员',
    memberBenefits: [],
    orderCount: 0,
    pendingOrderCount: 0,
    processingOrderCount: 0,
    completedOrderCount: 0,
    canceledOrderCount: 0,
    couponCount: 0,
    messageCount: 0,
    // 会员等级配置
    memberLevels: {
      NORMAL: '普通会员',
      SILVER: '银卡会员',
      GOLD: '金卡会员',
      DIAMOND: '钻石会员'
    }
  },

  onShow() {
    // 设置 tabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      });
    }
    
    // 页面显示时获取最新的用户信息
    this.checkLoginStatus();
    this.loadUserData();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = app.globalData.token || wx.getStorageSync('token');
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    
    // 清除过期的token
    if (token && !userInfo.id) {
      this.clearUserData();
      return;
    }
    
    // 设置登录状态
    this.setData({ 
      isLoggedIn: !!token && !!userInfo.id,
      userInfo: userInfo
    });
    
    // 更新会员等级文本
    if (userInfo.memberLevel) {
      const memberLevelText = this.data.memberLevels[userInfo.memberLevel] || '普通会员';
      this.setData({ memberLevelText });
    }
  },

  // 清除用户数据
  clearUserData() {
    app.globalData.token = '';
    app.globalData.userInfo = {};
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    this.setData({ 
      isLoggedIn: false,
      isGuestMode: false,
      userInfo: {}
    });
  },

  // 统一登录检查方法
  checkLoginAndNavigate(url) {
    if (!this.data.isLoggedIn) {
      this.goToLogin();
      return false;
    }
    wx.navigateTo({ url });
    return true;
  },

  // 跳转到登录页面
  goToLogin() {
    wx.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/auth/login/login'
          });
        }
      }
    });
  },

  // 加载用户相关数据
  loadUserData() {
    if (!this.data.isLoggedIn) return;
    
    // 模拟从服务器获取数据
    // 实际项目中需要调用API
    const mockOrders = [
      { id: 1, status: 1 }, // 待付款
      { id: 2, status: 2 }, // 待收货
      { id: 3, status: 3 }, // 已完成
      { id: 4, status: 1 }, // 待付款
      { id: 5, status: 3 }  // 已完成
    ];
    
    const pendingOrderCount = mockOrders.filter(order => order.status === 1).length;
    const processingOrderCount = mockOrders.filter(order => order.status === 2).length;
    const completedOrderCount = mockOrders.filter(order => order.status === 3).length;
    const canceledOrderCount = mockOrders.filter(order => order.status === 4).length;
    const totalOrderCount = mockOrders.length;
    
    const mockCouponCount = 2;
    const mockMessageCount = 5;
    
    this.setData({
      orderCount: totalOrderCount,
      pendingOrderCount,
      processingOrderCount,
      completedOrderCount,
      canceledOrderCount,
      couponCount: mockCouponCount,
      messageCount: mockMessageCount,
      memberBenefits: this.getMemberBenefits()
    });
  },

  // 获取会员权益
  getMemberBenefits() {
    const memberLevel = this.data.userInfo.memberLevel || 'NORMAL';
    let benefits = [];
    
    // 根据会员等级返回不同的权益
    switch (memberLevel) {
      case 'SILVER':
        benefits = [
          { icon: '🎁', text: '专属优惠' },
          { icon: '🍽️', text: '优先预订' },
          { icon: '🎂', text: '生日特权' }
        ];
        break;
      case 'GOLD':
        benefits = [
          { icon: '🎁', text: '专属优惠' },
          { icon: '🍽️', text: '优先预订' },
          { icon: '🎂', text: '生日特权' },
          { icon: '🚗', text: '免费配送' }
        ];
        break;
      case 'DIAMOND':
        benefits = [
          { icon: '🎁', text: '专属优惠' },
          { icon: '🍽️', text: '优先预订' },
          { icon: '🎂', text: '生日特权' },
          { icon: '🚗', text: '免费配送' },
          { icon: '👑', text: '专属服务' }
        ];
        break;
      default:
        benefits = [
          { icon: '🎁', text: '积分奖励' },
          { icon: '🎂', text: '生日优惠' }
        ];
    }
    
    return benefits;
  },

  // 微信一键登录
  onQuickLogin() {
    // 模拟微信授权登录
    wx.showLoading({ title: '登录中...' });
    
    // 实际项目中需要使用 wx.login 获取 code，然后发送到后端换取 token
    // 这里使用模拟数据
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟登录成功，设置用户信息
      const mockUserInfo = {
        id: 10001,
        username: 'wechat_user',
        nickname: '微信用户',
        avatar: '/images/common/default-avatar.png',
        memberLevel: 'SILVER',
        growthValue: 350,
        points: 1200,
        tastePreference: '清淡、偏甜'
      };
      
      // 设置token和用户信息
      const mockToken = 'mock_jwt_token_' + Date.now();
      app.globalData.token = mockToken;
      app.globalData.userInfo = mockUserInfo;
      wx.setStorageSync('token', mockToken);
      wx.setStorageSync('userInfo', mockUserInfo);
      
      // 更新页面数据
      this.setData({
        isLoggedIn: true,
        isGuestMode: false,
        userInfo: mockUserInfo,
        memberLevelText: this.data.memberLevels[mockUserInfo.memberLevel]
      });
      
      // 加载用户数据
      this.loadUserData();
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
    }, 1500);
  },

  // 账号密码登录
  onAccountLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  },

  // 游客模式
  onGuestMode() {
    this.setData({
      isGuestMode: true,
      isLoggedIn: false
    });
    
    wx.showToast({
      title: '已进入游客模式',
      icon: 'none'
    });
  },

  // 编辑个人资料
  onEditProfile() {
    if (!this.data.isLoggedIn) {
      this.goToLogin();
      return;
    }
    // 这里可以跳转到编辑个人资料页面
    wx.showToast({
      title: '编辑个人资料功能开发中',
      icon: 'none'
    });
  },

  // 我的订单
  onMyOrders() {
    // 订单页在 tabBar 中，使用 switchTab
    if (!this.data.isLoggedIn) {
      this.goToLogin();
      return;
    }
    wx.switchTab({
      url: '/pages/orders/list/list'
    });
  },

  // 浏览历史
  onBrowseHistory() {
    if (!this.data.isLoggedIn) {
      this.goToLogin();
      return;
    }
    // 暂时显示提示，后续可以创建专门的浏览历史页面
    wx.showToast({
      title: '浏览历史功能开发中',
      icon: 'none'
    });
  },

  // 收货地址
  onMyAddress() {
    this.checkLoginAndNavigate('/pages/address/list/list');
  },

  // 我的优惠券
  onMyCoupons() {
    this.checkLoginAndNavigate('/pages/coupons/list/list');
  },

  // 我的收藏
  onMyFavorites() {
    this.checkLoginAndNavigate('/pages/favorites/list/list');
  },

  // 积分商城
  onPointsMall() {
    // 积分商城不需要登录也可以访问
    wx.navigateTo({
      url: '/pages/points/mall/mall'
    });
  },

  // 系统设置
  onSettings() {
    this.checkLoginAndNavigate('/pages/settings/index/index');
  },

  // 消息中心
  onMessages() {
    // 消息中心不需要登录也可以访问
    wx.navigateTo({
      url: '/pages/messages/list/list'
    });
  },

  // 关于我们
  onAbout() {
    // 关于我们页面不需要登录
    wx.navigateTo({
      url: '/pages/about/index/index'
    });
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          this.clearUserData();
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  }
});