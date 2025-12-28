const app = getApp();

Page({
  data: {
    currentTab: 'all',
    allMessages: [],
    filteredMessages: [],
    allCount: 0,
    orderCount: 0,
    promotionCount: 0,
    memberCount: 0,
    loading: false
  },

  onShow() {
    this.loadMessages();
  },

  // 加载消息数据
  loadMessages() {
    this.setData({ loading: true });
    
    // 模拟从服务器获取数据
    // 实际项目中需要调用API
    setTimeout(() => {
      const mockMessages = this.generateMockMessages();
      const allCount = mockMessages.length;
      const orderCount = mockMessages.filter(msg => msg.type === 'order').length;
      const promotionCount = mockMessages.filter(msg => msg.type === 'promotion').length;
      const memberCount = mockMessages.filter(msg => msg.type === 'member').length;
      
      this.setData({
        allMessages: mockMessages,
        allCount,
        orderCount,
        promotionCount,
        memberCount,
        loading: false
      });
      
      this.filterMessages();
    }, 500);
  },

  // 生成模拟消息数据
  generateMockMessages() {
    const now = new Date();
    const messages = [
      {
        id: 1,
        title: '订单已完成',
        content: '您的订单#202512260001已确认完成，感谢您的订购！',
        type: 'order',
        read: false,
        createTime: new Date(now.getTime() - 1 * 60 * 60 * 1000) // 1小时前
      },
      {
        id: 2,
        title: '新品推荐',
        content: '新品上市！四川口水鸡限时优惠，快来尝鲜吧！',
        type: 'promotion',
        read: false,
        createTime: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2小时前
      },
      {
        id: 3,
        title: '会员升级提醒',
        content: '恭喜您！您的会员等级即将升级，享受更多特权！',
        type: 'member',
        read: true,
        createTime: new Date(now.getTime() - 5 * 60 * 60 * 1000) // 5小时前
      },
      {
        id: 4,
        title: '优惠券即将过期',
        content: '您有2张优惠券即将过期，请及时使用！',
        type: 'promotion',
        read: true,
        createTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // 1天前
      },
      {
        id: 5,
        title: '订单配送中',
        content: '您的订单#202512250002正在配送中，预计30分钟送达！',
        type: 'order',
        read: true,
        createTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // 2天前
      },
      {
        id: 6,
        title: '生日特权',
        content: '亲爱的会员，生日快乐！您将获得一份特别的生日礼物！',
        type: 'member',
        read: false,
        createTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) // 3天前
      },
      {
        id: 7,
        title: '积分即将过期',
        content: '您有500积分将于本月月底过期，请及时使用！',
        type: 'member',
        read: true,
        createTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) // 4天前
      },
      {
        id: 8,
        title: '周末特惠',
        content: '周末特惠活动开启，全场8.8折！',
        type: 'promotion',
        read: false,
        createTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5天前
      }
    ];
    
    return messages;
  },

  // 筛选消息
  filterMessages() {
    const { currentTab, allMessages } = this.data;
    
    let filtered = allMessages;
    
    if (currentTab !== 'all') {
      filtered = allMessages.filter(msg => msg.type === currentTab);
    }
    
    // 按时间倒序排列
    filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    
    this.setData({ filteredMessages: filtered });
  },

  // 切换标签页
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.filterMessages();
  },

  // 获取消息图标
  getMessageIcon(type) {
    const icons = {
      order: '📦',
      promotion: '🎁',
      member: '👑'
    };
    
    return icons[type] || '📧';
  },

  // 格式化时间
  formatTime(time) {
    const now = new Date();
    const messageTime = new Date(time);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    
    if (diffMins < 1) {
      return '刚刚';
    } else if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return `${messageTime.getMonth() + 1}月${messageTime.getDate()}日`;
    }
  },

  // 点击消息
  onMessageTap(e) {
    const id = e.currentTarget.dataset.id;
    const message = this.data.allMessages.find(msg => msg.id === id);
    
    if (!message.read) {
      // 标记为已读
      this.markRead(id);
    }
    
    // 根据消息类型进行不同处理
    if (message.type === 'order') {
      // 跳转到订单详情页
      wx.navigateTo({
        url: `/pages/orders/detail/detail?id=${id}`
      });
    } else if (message.type === 'promotion') {
      // 跳转到活动页面
      wx.navigateTo({
        url: '/pages/activities/list/list'
      });
    } else if (message.type === 'member') {
      // 跳转到会员中心
      wx.navigateTo({
        url: '/pages/me/me'
      });
    }
  },

  // 标记为已读
  markRead(id) {
    const messages = this.data.allMessages.map(msg => {
      if (msg.id === id) {
        return { ...msg, read: true };
      }
      return msg;
    });
    
    const allCount = messages.length;
    const orderCount = messages.filter(msg => msg.type === 'order').length;
    const promotionCount = messages.filter(msg => msg.type === 'promotion').length;
    const memberCount = messages.filter(msg => msg.type === 'member').length;
    
    this.setData({
      allMessages: messages,
      allCount,
      orderCount,
      promotionCount,
      memberCount
    });
    
    this.filterMessages();
  },

  // 点击标为已读按钮
  onMarkRead(e) {
    // 校验事件对象，避免类型错误
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation(); // 阻止事件冒泡
    }
    
    const id = e.currentTarget.dataset.id;
    this.markRead(id);
  },

  // 删除消息
  deleteMessage(id) {
    const messages = this.data.allMessages.filter(msg => msg.id !== id);
    
    const allCount = messages.length;
    const orderCount = messages.filter(msg => msg.type === 'order').length;
    const promotionCount = messages.filter(msg => msg.type === 'promotion').length;
    const memberCount = messages.filter(msg => msg.type === 'member').length;
    
    this.setData({
      allMessages: messages,
      allCount,
      orderCount,
      promotionCount,
      memberCount
    });
    
    this.filterMessages();
    
    wx.showToast({
      title: '消息已删除',
      icon: 'success'
    });
  },

  // 点击删除按钮
  onDelete(e) {
    // 校验事件对象，避免类型错误
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation(); // 阻止事件冒泡
    }
    
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条消息吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteMessage(id);
        }
      }
    });
  },

  // 全部标为已读
  onMarkAllRead() {
    const messages = this.data.allMessages.map(msg => ({ ...msg, read: true }));
    
    this.setData({
      allMessages: messages,
      allCount: messages.length,
      orderCount: messages.filter(msg => msg.type === 'order').length,
      promotionCount: messages.filter(msg => msg.type === 'promotion').length,
      memberCount: messages.filter(msg => msg.type === 'member').length
    });
    
    this.filterMessages();
    
    wx.showToast({
      title: '已全部标为已读',
      icon: 'success'
    });
  },

  // 清空消息
  onDeleteAll() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有消息吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            allMessages: [],
            filteredMessages: [],
            allCount: 0,
            orderCount: 0,
            promotionCount: 0,
            memberCount: 0
          });
          
          wx.showToast({
            title: '消息已清空',
            icon: 'success'
          });
        }
      }
    });
  }
});