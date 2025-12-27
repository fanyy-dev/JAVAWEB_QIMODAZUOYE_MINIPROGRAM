const app = getApp();

Page({
  data: {
    phone: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    loading: false,
    isPhoneValid: false // 标记手机号格式是否合法
  },

  // 手机号输入
  onPhoneInput(e) {
    const phone = e.detail.value;
    this.setData({ 
      phone,
      isPhoneValid: /^1[3-9]\d{9}$/.test(phone) // 实时校验手机号格式
    });
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  // 确认密码输入
  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  // 切换密码显示状态
  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword });
  },

  // 注册
  onRegister() {
    const { phone, password, confirmPassword } = this.data;
    
    // 表单验证
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    
    if (password.length < 6) {
      wx.showToast({ title: '密码不能少于6位', icon: 'none' });
      return;
    }
    
    if (password !== confirmPassword) {
      wx.showToast({ title: '两次密码输入不一致', icon: 'none' });
      return;
    }
    
    this.setData({ loading: true });
    
    app.register(phone, password).then(res => {
      // 保存登录状态
      app.globalData.token = res.token;
      app.globalData.userInfo = res.user;
      
      // 保存到本地存储
      wx.setStorageSync('token', res.token);
      wx.setStorageSync('userInfo', res.user);
      
      wx.showToast({ title: '注册成功', icon: 'success' });
      
      // 延迟返回首页
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1500);
    }).catch(err => {
      console.error('注册失败', err);
      wx.showToast({ title: err.message || '注册失败', icon: 'none' });
    }).finally(() => {
      this.setData({ loading: false });
    });
  }
});