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
    wx.showLoading({
      title: '加载中...'
    });
    
    app.request({
      url: `/address/${addressId}`,
      method: 'GET'
    }).then(address => {
      wx.hideLoading();
      
      // 字段名映射
      const formData = {
        id: address.id,
        name: address.contactName,
        phone: address.contactPhone,
        province: address.province,
        city: address.city,
        district: address.district,
        detail: address.detailAddress,
        isDefault: address.isDefault === 1
      };
      
      this.setData({ 
        formData: formData,
        region: [address.province, address.city, address.district]
      });
    }).catch(err => {
      wx.hideLoading();
      console.error('加载地址失败:', err);
      setTimeout(() => wx.navigateBack(), 1500);
    });
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
    
    // 准备请求数据（字段名映射）
    const requestData = {
      id: this.data.formData.id,
      contactName: name,
      contactPhone: phone,
      province: province,
      city: city,
      district: district,
      detailAddress: detail,
      isDefault: this.data.formData.isDefault ? 1 : 0
    };
    
    wx.showLoading({
      title: '保存中...'
    });
    
    // 调用后端API
    const url = this.data.isEditing ? '/address/update' : '/address/add';
    const method = this.data.isEditing ? 'PUT' : 'POST';
    
    app.request({
      url: url,
      method: method,
      data: requestData
    }).then(() => {
      wx.hideLoading();
      wx.showToast({
        title: this.data.isEditing ? '地址已更新' : '地址已添加',
        icon: 'success'
      });
      
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      wx.hideLoading();
      console.error('保存地址失败:', err);
    });
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  }
});
