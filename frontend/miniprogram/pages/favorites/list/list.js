const app = getApp();

Page({
  data: {
    favorites: [],
    favoriteType: ['全部', '美食', '门店'],
    currentType: 0,
    loading: false
  },

  onShow() {
    // 页面显示时检查登录状态
    if (!app.globalData.token) {
      this.goToLogin();
      return;
    }
    // 加载收藏列表
    this.loadFavorites();
  },

  // 加载收藏列表
  loadFavorites() {
    this.setData({ loading: true });
    
    // 模拟收藏数据
    const mockFavorites = [
      {
        id: 1,
        type: 0, // 美食
        name: '宫保鸡丁',
        image: '/images/dishes/gongbaojiding.jpg',
        price: 38,
        storeName: '川味馆',
        createTime: '2025-12-20'
      },
      {
        id: 2,
        type: 0, // 美食
        name: '水煮鱼',
        image: '/images/dishes/shuizhuyu.jpg',
        price: 68,
        storeName: '沸腾鱼乡',
        createTime: '2025-12-18'
      },
      {
        id: 3,
        type: 1, // 门店
        name: '川味馆',
        image: '/images/stores/restaurant_101.jpg',
        rating: 4.8,
        address: '北京市朝阳区建国路88号',
        createTime: '2025-12-15'
      },
      {
        id: 4,
        type: 1, // 门店
        name: '沸腾鱼乡',
        image: '/images/stores/restaurant_102.jpg',
        rating: 4.5,
        address: '北京市海淀区中关村大街1号',
        createTime: '2025-12-10'
      }
    ];
    
    // 模拟网络请求延迟
    setTimeout(() => {
      this.setData({
        favorites: mockFavorites,
        loading: false
      });
    }, 500);
  },

  // 切换收藏类型
  onTypeChange(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentType: index });
  },

  // 取消收藏
  onCancelFavorite(e) {
    const favoriteId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消收藏吗？',
      success: (res) => {
        if (res.confirm) {
          // 模拟取消收藏
          const newFavorites = this.data.favorites.filter(item => item.id !== favoriteId);
          this.setData({ favorites: newFavorites });
          wx.showToast({
            title: '已取消收藏',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看详情
  onViewDetail(e) {
    const item = e.currentTarget.dataset.item;
    if (item.type === 0) {
      // 美食详情
      wx.navigateTo({
        url: `/pages/dish/detail/detail?id=${item.id}`
      });
    } else {
      // 门店详情
      wx.navigateTo({
        url: `/pages/store/detail/detail?id=${item.id}`
      });
    }
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  }
});