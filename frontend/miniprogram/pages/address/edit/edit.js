const app = getApp();

Page({
  data: {
    formData: {
      id: null,
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    },
    isEditing: false,
    region: ['', '', ''],  // 地区选择器默认值
    customItem: '全部'  // 自定义选项
  },

  onLoad(options) {
    // 页面加载时检查登录状态
    if (!app.globalData.token) {
      this.goToLogin();
      return;
    }
    
    // 如果有id参数，说明是编辑地址
    if (options.id) {
      this.setData({ isEditing: true });
      this.loadAddressData(options.id);
    }
  },

  // 加载地址数据（编辑模式）
  loadAddressData(addressId) {
    // 模拟地址数据
    const mockAddress = {
      id: addressId,
      name: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '建国路88号现代城A座1001室',
      isDefault: true
    };
    
    // 模拟网络请求延迟
    setTimeout(() => {
      this.setData({ 
        formData: mockAddress,
        region: [mockAddress.province, mockAddress.city, mockAddress.district]  // 初始化地区选择器
      });
    }, 500);
  },

  // 表单输入处理
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({ [`formData.${field}`]: value });
  },

  // 地区选择器变化
  onRegionChange(e) {
    const [province, city, district] = e.detail.value;
    this.setData({
      region: e.detail.value,
      'formData.province': province,
      'formData.city': city,
      'formData.district': district
    });
    console.log('选择地区:', province, city, district);
  },

  // 切换默认地址
  onToggleDefault() {
    this.setData({ [`formData.isDefault`]: !this.data.formData.isDefault });
  },

  // 保存地址
  onSaveAddress() {
    // 表单验证
    const { name, phone, province, city, district, detail } = this.data.formData;
    if (!name || !phone || !province || !city || !district || !detail) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    
    // 手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }
    
    // 模拟保存地址
    wx.showLoading({
      title: '保存中...'
    });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: this.data.isEditing ? '地址已更新' : '地址已添加',
        icon: 'success'
      });
      
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  }
});
