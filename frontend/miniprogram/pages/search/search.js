// pages/search/search.js
const app = getApp()

Page({
  data: {
    keyword: '',
    focus: true,
    hasSearched: false,
    activeTab: 'dish',
    historyList: [],
    hotList: ['宫保鸡丁', '麻婆豆腐', '红烧肉', '糖醋排骨', '鱼香肉丝'],
    dishList: [],
    storeList: []
  },

  onLoad() {
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({ historyList: history })
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSearch() {
    const { keyword } = this.data
    if (!keyword.trim()) return

    // 保存搜索历史
    this.saveHistory(keyword)

    // 执行搜索
    this.doSearch(keyword)
  },

  doSearch(keyword) {
    wx.showLoading({ title: '搜索中...' })

    // 并行搜索菜品和门店
    Promise.all([
      this.searchDishes(keyword),
      this.searchStores(keyword)
    ]).then(([dishes, stores]) => {
      this.setData({
        dishList: dishes,
        storeList: stores,
        hasSearched: true
      })
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '搜索失败', icon: 'none' })
    })
  },

  searchDishes(keyword) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.baseUrl}/dish/list`,
        data: { keyword, pageSize: 20 },
        success: (res) => {
          if (res.data.code === 200) {
            resolve(res.data.data.records || [])
          } else {
            resolve([])
          }
        },
        fail: () => resolve([])
      })
    })
  },

  searchStores(keyword) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.baseUrl}/store/list`,
        data: { keyword, pageSize: 20 },
        success: (res) => {
          if (res.data.code === 200) {
            const stores = res.data.data.records || []
            stores.forEach(store => {
              if (store.images && typeof store.images === 'string') {
                try {
                  store.images = JSON.parse(store.images)
                } catch (e) {
                  store.images = []
                }
              }
            })
            resolve(stores)
          } else {
            resolve([])
          }
        },
        fail: () => resolve([])
      })
    })
  },

  saveHistory(keyword) {
    let history = wx.getStorageSync('searchHistory') || []
    const index = history.indexOf(keyword)
    if (index > -1) {
      history.splice(index, 1)
    }
    history.unshift(keyword)
    history = history.slice(0, 10) // 最多保存10条
    wx.setStorageSync('searchHistory', history)
    this.setData({ historyList: history })
  },

  clearHistory() {
    wx.setStorageSync('searchHistory', [])
    this.setData({ historyList: [] })
  },

  onClear() {
    this.setData({
      keyword: '',
      hasSearched: false,
      dishList: [],
      storeList: []
    })
  },

  onCancel() {
    wx.navigateBack()
  },

  onHistoryTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.doSearch(keyword)
  },

  onHotTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.saveHistory(keyword)
    this.doSearch(keyword)
  },

  onTabChange(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  onDishTap(e) {
    wx.navigateTo({
      url: `/pages/dish/detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },

  onStoreTap(e) {
    wx.navigateTo({
      url: `/pages/store/detail/detail?id=${e.currentTarget.dataset.id}`
    })
  }
})
