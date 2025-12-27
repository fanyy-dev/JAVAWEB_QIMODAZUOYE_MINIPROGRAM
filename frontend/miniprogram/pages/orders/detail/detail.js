const app = getApp();

Page({
  data: {
    order: null,
    orderId: '',
    loading: true
  },

  onLoad(options) {
    // 获取订单ID
    this.setData({ orderId: options.id });
    // 加载订单详情
    this.loadOrderDetail();
  },

  // 加载订单详情
  loadOrderDetail() {
    this.setData({ loading: true });
    
    // 调用后端API获取订单详情
    app.request({
      url: `/order/${this.data.orderId}`,
      method: 'GET',
      requireAuth: true
    }).then(order => {
      console.log('订单详情:', order);
      this.setData({
        order: order,
        loading: false
      });
    }).catch(err => {
      console.error('加载订单失败:', err);
      wx.showToast({ title: '加载订单失败', icon: 'error' });
      this.setData({ loading: false });
    });
  },

  // 支付订单
  onPayOrder() {
    wx.showModal({
      title: '模拟支付',
      content: '是否确认支付订单？',
      confirmText: '确认支付',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '支付中...' });
          
          // 调用后端支付接口
          app.request({
            url: `/order/${this.data.orderId}/pay`,
            method: 'POST',
            data: {
              payMethod: 'WECHAT',
              payAmount: this.data.order.actualAmount || this.data.order.totalAmount
            },
            requireAuth: true
          }).then(() => {
            wx.hideLoading();
            wx.showToast({ title: '支付成功', icon: 'success' });
            
            // 刷新订单详情
            setTimeout(() => {
              this.loadOrderDetail();
            }, 1500);
          }).catch(err => {
            wx.hideLoading();
            console.error('支付失败:', err);
            wx.showToast({ title: '支付失败', icon: 'error' });
          });
        }
      }
    });
  },

  // 取消订单
  onCancelOrder() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '取消中...' });
          
          // 调用后端取消接口
          app.request({
            url: `/order/${this.data.orderId}/cancel`,
            method: 'POST',
            requireAuth: true
          }).then(() => {
            wx.hideLoading();
            wx.showToast({ title: '订单已取消', icon: 'success' });
            
            // 刷新订单详情
            setTimeout(() => {
              this.loadOrderDetail();
            }, 1500);
          }).catch(err => {
            wx.hideLoading();
            console.error('取消失败:', err);
            wx.showToast({ title: '取消失败', icon: 'error' });
          });
        }
      }
    });
  },

  // 确认收货
  onConfirmReceipt() {
    wx.showModal({
      title: '确认收货',
      content: '请确认您已收到商品',
      success: (res) => {
        if (res.confirm) {
          // 模拟确认收货
          this.setData({
            'order.orderStatus': 'COMPLETED'
          });
          wx.showToast({
            title: '收货成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 评价订单
  onReviewOrder() {
    wx.navigateTo({
      url: `/pages/orders/review/review?orderId=${this.data.orderId}&storeId=${this.data.order.storeId || 1}`
    });
  }
});
