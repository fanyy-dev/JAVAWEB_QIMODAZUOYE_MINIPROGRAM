const app = getApp();

Page({
  data: {
    orders: [],
    filteredOrders: [],
    orderStatus: ['全部', '待付款', '待收货', '已完成', '已取消'],
    currentStatus: 0,
    loading: false
  },

  onShow(options) {
    // 页面显示时检查登录状态
    if (!app.globalData.token) {
      this.goToLogin();
      return;
    }
    
    // 检查是否有特定状态筛选参数
    if (options && options.status) {
      const statusMap = {
        'pending': 1,
        'processing': 2, 
        'completed': 3,
        'canceled': 4
      };
      const targetStatus = statusMap[options.status];
      if (targetStatus) {
        this.setData({ currentStatus: targetStatus });
      }
    }
    
    // 加载订单列表
    this.loadOrders();
  },

  // 加载订单列表
  loadOrders() {
    this.setData({ loading: true });
    
    // 模拟订单数据
    const mockOrders = [
      {
        id: 1,
        orderNo: 'ORD202512240001',
        totalPrice: 128.5,
        status: 1, // 待付款
        createTime: '2025-12-24 10:30:25',
        orderItems: [
          { dishName: '宫保鸡丁', price: 38, quantity: 1, image: '/images/dishes/gongbaojiding.jpg' },
          { dishName: '夫妻肺片', price: 28, quantity: 1, image: '/images/dishes/fuqifeipian.jpg' },
          { dishName: '米饭', price: 3, quantity: 2, image: '/images/dishes/mifan.jpg' }
        ]
      },
      {
        id: 2,
        orderNo: 'ORD202512240002',
        totalPrice: 68.0,
        status: 2, // 待收货
        createTime: '2025-12-24 09:15:30',
        orderItems: [
          { dishName: '水煮鱼', price: 68, quantity: 1, image: '/images/dishes/shuizhuyu.jpg' }
        ]
      },
      {
        id: 3,
        orderNo: 'ORD202512230001',
        totalPrice: 88.0,
        status: 3, // 已完成
        createTime: '2025-12-23 18:45:10',
        orderItems: [
          { dishName: '辣子鸡丁', price: 28, quantity: 1, image: '/images/dishes/lazijiding.jpg' },
          { dishName: '麻婆豆腐', price: 18, quantity: 1, image: '/images/dishes/mapodoufu.jpg' },
          { dishName: '冬瓜薏米汤', price: 22, quantity: 1, image: '/images/dishes/dongguayimitang.jpg' },
          { dishName: '米饭', price: 3, quantity: 2, image: '/images/dishes/mifan.jpg' }
        ]
      }
    ];
    
    // 模拟网络请求延迟
    setTimeout(() => {
      this.setData({
        orders: mockOrders,
        filteredOrders: mockOrders
      });
      this.filterOrders();
      this.setData({ loading: false });
    }, 500);
  },

  // 筛选订单
  filterOrders() {
    const { currentStatus, orders } = this.data;
    let filtered = orders;

    if (currentStatus > 0) {
      // 根据状态筛选订单
      filtered = orders.filter(order => {
        switch (currentStatus) {
          case 1: // 待付款
            return order.status === 1;
          case 2: // 待收货
            return order.status === 2;
          case 3: // 已完成
            return order.status === 3;
          case 4: // 已取消
            return order.status === 4;
          default:
            return true;
        }
      });
    }

    this.setData({ filteredOrders: filtered });
  },

  // 切换订单状态
  onStatusChange(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentStatus: index });
    this.filterOrders();
  },

  // 跳转到订单详情
  onOrderTap(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/orders/detail/detail?id=${orderId}`
    });
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  }
});
