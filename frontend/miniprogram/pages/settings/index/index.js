const app = getApp();

Page({
  data: {
    notificationEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    cacheSize: '2.3MB',
    version: '1.0.0'
  },

  onLoad() {
    // 页面加载时检查登录状态
    if (!app.globalData.token) {
      this.goToLogin();
      return;
    }
  },

  // 切换通知设置
  onToggleNotification(e) {
    const enabled = e.detail.value;
    this.setData({ notificationEnabled: enabled });
    wx.showToast({
      title: enabled ? '通知已开启' : '通知已关闭',
      icon: 'success'
    });
  },

  // 切换声音设置
  onToggleSound(e) {
    const enabled = e.detail.value;
    this.setData({ soundEnabled: enabled });
    wx.showToast({
      title: enabled ? '声音已开启' : '声音已关闭',
      icon: 'success'
    });
  },

  // 切换振动设置
  onToggleVibration(e) {
    const enabled = e.detail.value;
    this.setData({ vibrationEnabled: enabled });
    wx.showToast({
      title: enabled ? '振动已开启' : '振动已关闭',
      icon: 'success'
    });
  },

  // 清除缓存
  onClearCache() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          // 模拟清除缓存
          this.setData({ cacheSize: '0KB' });
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 账号安全
  onAccountSecurity() {
    wx.navigateTo({
      url: '/pages/settings/security/security'
    });
  },

  // 隐私政策
  onPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/settings/privacy/privacy'
    });
  },

  // 用户协议
  onUserAgreement() {
    wx.navigateTo({
      url: '/pages/settings/agreement/agreement'
    });
  },

  // 检测更新
  onCheckUpdate() {
    wx.showToast({
      title: '当前已是最新版本',
      icon: 'success'
    });
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  }
});