const app = getApp();

// 门店ID与图片文件名的映射关系
const storeImageMap = {
  1: 'restaurant_101.jpg',
  2: 'restaurant_102.jpg',
  3: 'restaurant_103.jpg'
};

Page({
  data: {
    storeList: [],
    keyword: '',
    pageNum: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadStoreList();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadStoreList();
    }
  },

  // 输入搜索关键词
  onInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  // 搜索
  onSearch() {
    this.setData({ pageNum: 1, storeList: [], hasMore: true });
    this.loadStoreList();
  },

  // 清空搜索
  clearSearch() {
    this.setData({ keyword: '' });
    this.onSearch();
  },

  // 加载门店列表
  loadStoreList() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });

    app.request({
      url: '/store/list',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        keyword: this.data.keyword
      }
    }).then(data => {
      // 处理图片URL，使用本地图片
      const processedRecords = data.records.map(store => {
        const imageName = storeImageMap[store.id];
        const imageUrl = imageName ? `/images/stores/${imageName}` : `/images/common/icon_search.png`;
        return {
          ...store,
          imageUrl: imageUrl,
          images: [imageUrl],
          tagList: store.tags ? store.tags.split(',') : []
        };
      });
      
      const newStoreList = this.data.pageNum === 1 ? processedRecords : [...this.data.storeList, ...processedRecords];
      const hasMore = newStoreList.length < data.total;

      this.setData({
        storeList: newStoreList,
        total: data.total,
        hasMore: hasMore,
        loading: false,
        pageNum: this.data.pageNum + 1
      });
    }).catch(err => {
      console.error('加载门店列表失败', err);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'error' });
    });
  },

  // 跳转到门店详情
  goToStoreDetail(e) {
    const storeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/store/detail/detail?id=${storeId}`
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ pageNum: 1, storeList: [], hasMore: true });
    this.loadStoreList().finally(() => {
      wx.stopPullDownRefresh();
    });
  }
});