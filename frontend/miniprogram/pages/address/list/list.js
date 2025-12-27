const app = getApp();

Page({
  data: {
    addresses: [],
    loading: false,
    selectedAddressId: null,
    mode: 'manage' // 管理模式或选择模式
  },

  onLoad(options) {
    // 获取模式参数
    if (options.mode) {
      this.setData({ mode: options.mode });
    }
  },

  onShow() {
    // 页面显示时检查登录状态
    if (!app.globalData.token) {
      this.goToLogin();
      return;
    }
    // 加载地址列表
    this.loadAddresses();
  },

  // 加载地址列表
  loadAddresses() {
    this.setData({ loading: true });
    
    // 模拟地址数据
    const mockAddresses = [
      {
        id: 1,
        name: '张三',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '建国路88号现代城A座1001室',
        isDefault: true
      },
      {
        id: 2,
        name: '李四',
        phone: '13900139000',
        province: '上海市',
        city: '上海市',
        district: '浦东新区',
        detail: '陆家嘴金融中心25楼',
        isDefault: false
      }
    ];
    
    // 模拟网络请求延迟
    setTimeout(() => {
      this.setData({
        addresses: mockAddresses,
        loading: false
      });
    }, 500);
  },

  // 选择地址
  onSelectAddress(e) {
    const addressId = e.currentTarget.dataset.id;
    this.setData({ selectedAddressId: addressId });
    
    const selectedAddress = this.data.addresses.find(addr => addr.id === addressId);
    
    // 如果是选择模式，使用 EventChannel 传递数据
    if (this.data.mode === 'select') {
      const eventChannel = this.getOpenerEventChannel();
      if (eventChannel && eventChannel.emit) {
        // 标准化地址对象字段
        const normalizedAddress = {
          id: selectedAddress.id,
          contactName: selectedAddress.name,
          contactPhone: selectedAddress.phone,
          province: selectedAddress.province,
          city: selectedAddress.city,
          district: selectedAddress.district,
          detailAddress: selectedAddress.detail,
          isDefault: selectedAddress.isDefault
        };
        eventChannel.emit('selectAddress', normalizedAddress);
      }
      wx.navigateBack();
    } else {
      // 管理模式，跳转到编辑页面
      this.onEditAddress(e);
    }
  },

  // 跳转到编辑地址页面
  onEditAddress(e) {
    const addressId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/address/edit/edit?id=${addressId}`
    });
  },

  // 跳转到新增地址页面
  onAddAddress() {
    wx.navigateTo({
      url: '/pages/address/edit/edit'
    });
  },

  // 删除地址
  onDeleteAddress(e) {
    const addressId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个地址吗？',
      success: (res) => {
        if (res.confirm) {
          // 模拟删除地址
          const newAddresses = this.data.addresses.filter(addr => addr.id !== addressId);
          this.setData({ addresses: newAddresses });
          wx.showToast({
            title: '地址已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
  }
});
