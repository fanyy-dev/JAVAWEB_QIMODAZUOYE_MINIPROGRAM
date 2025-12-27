Page({
  data: {
    appName: '饭店小程序',
    appLogo: '/images/common/bg_login.png',
    version: '1.0.0',
    description: '专注于为您提供优质的餐饮服务，让您轻松享受美食！',
    contactInfo: {
      customerService: '400-123-4567',
      email: 'service@fandian.com',
      address: '北京市朝阳区建国路88号'
    },
    copyright: '© 2025 饭店小程序 版权所有'
  },

  // 联系客服
  onContactService() {
    wx.showActionSheet({
      itemList: ['拨打电话', '发送邮件'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 拨打电话
          wx.makePhoneCall({
            phoneNumber: this.data.contactInfo.customerService
          });
        } else if (res.tapIndex === 1) {
          // 发送邮件
          wx.showToast({
            title: '邮件功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 关于我们详情
  onAboutDetail() {
    wx.navigateTo({
      url: '/pages/about/detail/detail'
    });
  },

  // 检查更新
  onCheckUpdate() {
    wx.showToast({
      title: '当前已是最新版本',
      icon: 'success'
    });
  }
});