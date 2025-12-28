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
    
    wx.request({
      url: app.globalData.baseUrl + '/address/list',
      method: 'GET',
      header: {
        'token': app.globalData.token
      },
      success: (res) => {
        if (res.data.code === 200) {
          // 字段名映射：后端返回 contactName/contactPhone/detailAddress
          const addresses = (res.data.data || []).map(addr => ({
            id: addr.id,
            name: addr.contactName,
            phone: addr.contactPhone,
            province: addr.province,
            city: addr.city,
            district: addr.district,
            detail: addr.detailAddress,
            isDefault: addr.isDefault === 1
          }));
          
          this.setData({
            addresses: addresses,
            loading: false
          });
        } else {
          this.setData({ loading: false });
          wx.showToast({
            title: res.data.message || '加载失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        this.setData({ loading: false });
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        console.error('加载地址列表失败:', err);
      }
    });
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
          // 调用后端API删除地址
          wx.request({
            url: app.globalData.baseUrl + `/address/${addressId}`,
            method: 'DELETE',
            header: {
              'token': app.globalData.token
            },
            success: (res) => {
              if (res.data.code === 200) {
                wx.showToast({
                  title: '地址已删除',
                  icon: 'success'
                });
                // 重新加载列表
                this.loadAddresses();
              } else {
                wx.showToast({
                  title: res.data.message || '删除失败',
                  icon: 'none'
                });
              }
            },
            fail: (err) => {
              wx.showToast({
                title: '网络请求失败',
                icon: 'none'
              });
              console.error('删除地址失败:', err);
            }
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
