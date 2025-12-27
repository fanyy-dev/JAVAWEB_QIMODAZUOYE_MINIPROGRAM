const app = getApp();

// 门店ID与图片文件名的映射关系
const storeImageMap = {
  1: 'restaurant_101.jpg',
  2: 'restaurant_102.jpg',
  3: 'restaurant_103.jpg'
};

Page({
  data: {
    store: {},
    loading: true,
    error: false
  },

  onLoad(options) {
    this.storeId = options.id;
    this.loadStoreDetail();
  },

  // 加载门店详情
  loadStoreDetail() {
    if (!this.storeId) {
      wx.showToast({ title: '参数错误', icon: 'error' });
      return;
    }

    this.setData({ loading: true, error: false });
    
    app.request({
      url: `/store/${this.storeId}`,
      method: 'GET'
    }).then(data => {
      // 处理图片URL，使用本地图片
      const imageName = storeImageMap[data.id];
      const imageUrl = imageName ? `/images/stores/${imageName}` : `/images/common/icon_search.png`;
      const processedStore = {
        ...data,
        imageUrl: imageUrl,
        images: [imageUrl],
        tagList: data.tags ? data.tags.split(',') : []
      };
      
      this.setData({ store: processedStore, loading: false });
    }).catch(err => {
      console.error('加载门店详情失败', err);
      this.setData({ error: true, loading: false });
      wx.showToast({ title: '加载失败', icon: 'error' });
    });
  },

  // 重新加载
  onRetry() {
    this.loadStoreDetail();
  },

  // 联系商家
  makePhoneCall() {
    const phone = this.data.store.phone;
    if (!phone) {
      wx.showToast({ title: '暂无联系电话', icon: 'none' });
      return;
    }

    wx.makePhoneCall({
      phoneNumber: phone,
      success: () => {
        console.log('拨打电话成功');
      },
      fail: (err) => {
        console.error('拨打电话失败', err);
        wx.showToast({ title: '拨打电话失败', icon: 'error' });
      }
    });
  },

  // 导航到店
  navigateToStore() {
    const { longitude, latitude, storeName } = this.data.store;
    
    if (!longitude || !latitude) {
      wx.showToast({ title: '暂无位置信息', icon: 'none' });
      return;
    }

    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      name: storeName,
      scale: 18
    });
  },

  // 查看门店菜单
  viewStoreDishes() {
    if (this.data.store.status !== 1) {
      wx.showToast({ title: '该门店已停业', icon: 'none' });
      return;
    }

    wx.navigateTo({
      url: `/pages/dish/list/list?storeId=${this.storeId}&storeName=${encodeURIComponent(this.data.store.storeName || '')}`
    });
  },

  // 返回上一页
  onBackTap() {
    wx.navigateBack();
  }
});