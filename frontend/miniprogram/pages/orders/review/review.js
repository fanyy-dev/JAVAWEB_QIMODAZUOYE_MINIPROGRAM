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
    wx.request({
      url: `${app.globalData.baseUrl}/order/${orderId}`,
      header: { 'Authorization': wx.getStorageSync('token') },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            orderNo: res.data.data.orderNo,
            storeId: res.data.data.storeId
          })
        }
      }
    })
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
    const { orderId, storeId, tasteRating, serviceRating, environmentRating, content, images, anonymous } = this.data
    const userInfo = wx.getStorageSync('userInfo')

    if (!orderId) {
      wx.showToast({ title: '订单信息错误', icon: 'none' })
      return
    }

    wx.showLoading({ title: '提交中...' })

    wx.request({
      url: `${app.globalData.baseUrl}/review`,
      method: 'POST',
      header: { 
        'Authorization': wx.getStorageSync('token'),
        'Content-Type': 'application/json'
      },
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
      success: (res) => {
        wx.hideLoading()
        if (res.data.code === 200) {
          wx.showToast({ title: '评价成功', icon: 'success' })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        } else {
          wx.showToast({ title: res.data.message || '评价失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '网络错误', icon: 'none' })
      }
    })
  }
})
