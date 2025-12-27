const app = getApp();

Page({
  data: {
    coupons: [],
    couponStatus: ['全部', '未使用', '已使用', '已过期'],
    currentStatus: 0,
    loading: false
  },

  onShow() {
    // 页面显示时检查登录状态
    if (!app.globalData.token) {
      this.goToLogin();
      return;
    }
    // 加载优惠券列表
    this.loadCoupons();
  },

  // 加载优惠券列表
  loadCoupons() {
    this.setData({ loading: true });
    
    // 模拟优惠券数据
    const mockCoupons = [
      {
        id: 1,
        couponName: '满100减20',
        couponType: '满减券',
        discount: 20,
        minAmount: 100,
        status: 0,
        startDate: '2025-12-01',
        endDate: '2025-12-31'
      },
      {
        id: 2,
        couponName: '8折优惠',
        couponType: '折扣券',
        discount: 80,
        minAmount: 50,
        status: 0,
        startDate: '2025-12-01',
        endDate: '2025-12-31'
      },
      {
        id: 3,
        couponName: '满50减10',
        couponType: '满减券',
        discount: 10,
        minAmount: 50,
        status: 1,
        startDate: '2025-11-01',
        endDate: '2025-11-30'
      },
      {
        id: 4,
        couponName: '新人专享5元券',
        couponType: '无门槛券',
        discount: 5,
        minAmount: 0,
        status: 2,
        startDate: '2025-10-01',
        endDate: '2025-10-31'
      }
    ];
    
    // 模拟网络请求延迟
    setTimeout(() => {
      this.setData({
        coupons: mockCoupons,
        loading: false
      });
    }, 500);
  },

  // 切换优惠券状态
  onStatusChange(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentStatus: index });
  },

  // 使用优惠券
  onUseCoupon(e) {
    const couponId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '使用优惠券功能开发中',
      icon: 'none'
    });
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  }
});