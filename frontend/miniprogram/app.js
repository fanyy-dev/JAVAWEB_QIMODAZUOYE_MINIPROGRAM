// app.js
App({
  globalData: {
    baseUrl: 'http://localhost:8080/api',  // 改为 localhost
    token: null,
    userInfo: null
  },

  onLaunch() {
    // 获取本地存储的token和用户信息
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token) {
      this.globalData.token = token;
    }
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  // 网络请求封装
  request(options) {
    const app = this;
    
    // 从 storage 中刷新 token，确保使用最新的 token
    const storageToken = wx.getStorageSync('token');
    if (storageToken && storageToken !== app.globalData.token) {
      console.log('[请求前] 刷新 token:', storageToken);
      app.globalData.token = storageToken;
    }
    
    // 创建默认header
    const defaultHeader = {
      'Content-Type': 'application/json',
      'Authorization': app.globalData.token ? 'Bearer ' + app.globalData.token : ''
    };
    
    // 合并header，options.header优先级更高
    const header = Object.assign({}, defaultHeader, options.header || {});
    
    console.log('请求信息:', {
      url: app.globalData.baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: header
    });
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.baseUrl + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: header,
        success(res) {
          console.log('响应信息:', res);
          
          // 添加严格的数据检查
          if (!res.data) {
            console.error('服务器响应数据为空:', res);
            wx.showToast({
              title: '请求失败',
              icon: 'none'
            });
            reject('服务器响应数据为空');
            return;
          }
          
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else if (res.data.code === 401) {
            // 未登录或登录过期
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            app.globalData.token = null;
            app.globalData.userInfo = null;
            
            // 只在需要登录的页面显示登录提示
            if (options.requireAuth) {
              wx.showModal({
                title: '提示',
                content: '请先登录',
                success(modalRes) {
                  if (modalRes.confirm) {
                    wx.navigateTo({
                      url: '/pages/auth/login/login'
                    });
                  }
                }
              });
            }
            reject(res.data.message || '未授权');
          } else {
            console.error('请求失败，响应码:', res.data.code, '响应信息:', res.data.message);
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data.message || '请求失败');
          }
        },
        fail(err) {
          console.error('网络请求失败:', err);
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          reject(err);
        }
      });
    });
  },

  // 登录
  login(username, password) {
    const app = this;
    
    // 使用JSON格式的数据
    const data = {
      username: username,
      password: password
    };
    
    return app.request({
      url: '/auth/login',
      method: 'POST',
      data: data
    }).then(data => {
      console.log('登录响应数据:', data);
      
      // 后端返回的字段是 userInfo，不是 user
      const userInfo = data.userInfo || data.user;
      
      app.globalData.token = data.token;
      app.globalData.userInfo = userInfo;
      wx.setStorageSync('token', data.token);
      wx.setStorageSync('userInfo', userInfo);
      
      console.log('已保存 token:', data.token);
      console.log('已保存 userInfo:', userInfo);
      
      return data;
    });
  },

  // 注册
  register(phone, password) {
    const app = this;
    // 自动生成用户名：使用手机号的后4位
    const username = 'user_' + phone.substring(phone.length - 4);
    
    // 使用表单形式的数据
    const formData = `phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}&username=${encodeURIComponent(username)}`;
    
    return app.request({
      url: '/auth/register',
      method: 'POST',
      data: formData,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(data => {
      console.log('注册响应数据:', data);
      
      // 后端返回的字段是 userInfo，不是 user
      const userInfo = data.userInfo || data.user;
      
      app.globalData.token = data.token;
      app.globalData.userInfo = userInfo;
      wx.setStorageSync('token', data.token);
      wx.setStorageSync('userInfo', userInfo);
      
      console.log('已保存 token:', data.token);
      console.log('已保存 userInfo:', userInfo);
      
      return data;
    });
  },

  // 退出登录
  logout() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  }
});
