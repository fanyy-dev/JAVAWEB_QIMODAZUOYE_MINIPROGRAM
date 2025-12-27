// pages/orders/confirm/confirm.js
const app = getApp()

Page({
  data: {
    orderType: 'TAKEOUT', // TAKEOUT-外卖, DINE_IN-堂食
    address: null,
    items: [],
    remark: '',
    totalPrice: 0,
    deliveryFee: 5,
    actualAmount: 0
  },

  onLoad() {
    this.loadOrderData()
    this.loadDefaultAddress()
  },

  // 加载订单数据
  loadOrderData() {
    const pendingOrder = wx.getStorageSync('pendingOrder')
    if (!pendingOrder) {
      wx.showToast({ title: '订单数据错误', icon: 'error' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }

    const items = pendingOrder.items || pendingOrder.dishes || []
    const totalPrice = pendingOrder.totalPrice || this.calculateTotal(items)

    this.setData({
      items,
      totalPrice: parseFloat(totalPrice).toFixed(2)
    })

    this.calculateActualAmount()
  },

  // 计算总价
  calculateTotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  },

  // 计算实付金额
  calculateActualAmount() {
    const { totalPrice, deliveryFee, orderType } = this.data
    const fee = orderType === 'TAKEOUT' ? deliveryFee : 0
    const actual = (parseFloat(totalPrice) + fee).toFixed(2)
    this.setData({ actualAmount: actual })
  },

  // 加载默认地址
  loadDefaultAddress() {
    const addresses = wx.getStorageSync('addresses') || []
    const defaultAddr = addresses.find(addr => addr.isDefault) || addresses[0]
    if (defaultAddr) {
      this.setData({ address: defaultAddr })
    }
  },

  // 选择订单类型
  selectType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ orderType: type })
    this.calculateActualAmount()
  },

  // 选择地址
  selectAddress() {
    wx.navigateTo({
      url: '/pages/address/list/list?mode=select',
      events: {
        selectAddress: (address) => {
          this.setData({ address })
        }
      }
    })
  },

  // 备注输入
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  // 提交订单
  submitOrder() {
    const { orderType, address, items, remark, actualAmount } = this.data
    const token = wx.getStorageSync('token') || app.globalData.token
    const userInfo = wx.getStorageSync('userInfo') || app.globalData.userInfo

    console.log('=== 提交订单调试信息 ===')
    console.log('Storage token:', wx.getStorageSync('token'))
    console.log('GlobalData token:', app.globalData.token)
    console.log('Final token:', token)
    console.log('Storage userInfo:', wx.getStorageSync('userInfo'))
    console.log('GlobalData userInfo:', app.globalData.userInfo)
    console.log('Final userInfo:', userInfo)

    // 刷新 app.globalData 中的 token
    if (token && !app.globalData.token) {
      app.globalData.token = token
      console.log('已刷新 app.globalData.token')
    }
    if (userInfo && !app.globalData.userInfo) {
      app.globalData.userInfo = userInfo
      console.log('已刷新 app.globalData.userInfo')
    }

    if (!token || !userInfo || !userInfo.id) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/auth/login/login' })
          }
        }
      })
      return
    }

    if (orderType === 'TAKEOUT' && !address) {
      wx.showToast({ title: '请选择配送地址', icon: 'none' })
      return
    }

    if (items.length === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' })
      return
    }

    wx.showLoading({ title: '提交中...' })

    // 构建订单数据
    const orderData = {
      userId: userInfo.id,
      storeId: 1, // 默认门店
      orderType,
      totalAmount: this.data.totalPrice,
      deliveryFee: orderType === 'TAKEOUT' ? this.data.deliveryFee : 0,
      actualAmount,
      remark,
      contactName: address?.contactName,
      contactPhone: address?.contactPhone,
      deliveryAddress: address ? `${address.province}${address.city}${address.district}${address.detailAddress}` : null,
      orderItems: items.map(item => ({
        itemType: 'DISH',
        itemId: item.id,
        itemName: item.dishName,
        itemImage: item.image,
        price: item.price,
        quantity: item.quantity,
        subtotal: (item.price * item.quantity).toFixed(2)
      }))
    }

    // 调用后端API创建订单
    app.request({
      url: '/order/create',
      method: 'POST',
      data: orderData,
      requireAuth: true
    }).then((data) => {
      wx.hideLoading()
      wx.showToast({ title: '订单创建成功', icon: 'success' })
      
      // 清除待支付订单数据
      wx.removeStorageSync('pendingOrder')
      
      // 如果来自购物车，清空已选商品
      const cart = wx.getStorageSync('cart') || []
      const remainingCart = cart.filter(cartItem => 
        !items.some(orderItem => orderItem.id === cartItem.id)
      )
      wx.setStorageSync('cart', remainingCart)
      
      // 跳转到订单详情或列表
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/orders/detail/detail?id=${data.id}`,
          fail: () => {
            wx.switchTab({ url: '/pages/orders/list/list' })
          }
        })
      }, 1500)
    }).catch((err) => {
      wx.hideLoading()
      console.error('订单创建失败:', err)
      wx.showToast({ title: err || '订单创建失败', icon: 'none' })
    })
  }
})
