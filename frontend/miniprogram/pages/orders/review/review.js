// pages/orders/review/review.js
const app = getApp()

Page({
  data: {
    orderId: '',
    orderNo: '',
    storeId: '',
    tasteRating: 5,
    serviceRating: 5,
    environmentRating: 5,
    content: '',
    images: [],
    anonymous: false
  },

  onLoad(options) {
    if (options.orderId) {
      this.setData({ orderId: options.orderId })
      this.loadOrderInfo(options.orderId)
    }
    if (options.orderNo) {
      this.setData({ orderNo: options.orderNo })
    }
    if (options.storeId) {
      this.setData({ storeId: options.storeId })
    }
  },

  loadOrderInfo(orderId) {
    app.request({
      url: `/order/${orderId}`,
      method: 'GET',
      requireAuth: true
    }).then(data => {
      this.setData({
        orderNo: data.orderNo,
        storeId: data.storeId
      });
    }).catch(err => {
      console.error('加载订单信息失败:', err);
    });
  },

  onTasteRate(e) {
    this.setData({ tasteRating: e.currentTarget.dataset.value })
  },

  onServiceRate(e) {
    this.setData({ serviceRating: e.currentTarget.dataset.value })
  },

  onEnvironmentRate(e) {
    this.setData({ environmentRating: e.currentTarget.dataset.value })
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  onAnonymousChange(e) {
    this.setData({ anonymous: e.detail.value })
  },

  onChooseImage() {
    const count = 9 - this.data.images.length
    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 这里实际项目需要上传图片到服务器获取URL
        // 简化处理，直接使用本地路径
        const newImages = [...this.data.images, ...res.tempFilePaths]
        this.setData({ images: newImages })
      }
    })
  },

  onDeleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },

  onSubmit() {
    const { orderId, storeId, tasteRating, serviceRating, environmentRating, content, images, anonymous } = this.data;
    const userInfo = wx.getStorageSync('userInfo') || app.globalData.userInfo;

    if (!orderId) {
      wx.showToast({ title: '订单信息错误', icon: 'none' });
      return;
    }

    if (!userInfo || !userInfo.id) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    if (!content || content.trim().length === 0) {
      wx.showToast({ title: '请输入评价内容', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    app.request({
      url: '/review',
      method: 'POST',
      data: {
        orderId: parseInt(orderId),
        userId: userInfo.id,
        storeId: parseInt(storeId),
        tasteRating,
        serviceRating,
        environmentRating,
        content,
        images: JSON.stringify(images),
        anonymous: anonymous ? 1 : 0
      },
      requireAuth: true
    }).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '评价成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      wx.hideLoading();
      console.error('评价失败:', err);
      wx.showToast({ title: '评价失败', icon: 'error' });
    });
  }
})
