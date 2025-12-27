Component({
  data: {
    selected: 0,
    color: "#666666",
    selectedColor: "#ff6b35",
    list: [
      {
        pagePath: "/pages/index/index",
        emoji: "🏠",
        text: "首页"
      },
      {
        pagePath: "/pages/cart/list/list",
        emoji: "🛒",
        text: "购物车"
      },
      {
        pagePath: "/pages/orders/list/list",
        emoji: "📝",
        text: "订单"
      },
      {
        pagePath: "/pages/me/me",
        emoji: "👤",
        text: "我的"
      }
    ]
  },
  
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
    }
  }
});
