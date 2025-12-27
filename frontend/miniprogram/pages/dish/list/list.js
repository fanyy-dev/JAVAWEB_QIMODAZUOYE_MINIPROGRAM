// pages/dish/list/list.js
const app = getApp();

// 菜品ID与图片文件名的映射关系
const dishImageMap = {
  1: 'gongbaojiding.jpg',
  2: 'fuqifeipian.jpg',
  3: 'shuizhuyu.jpg',
  4: 'lazijiding.jpg',
  5: 'mapodoufu.jpg',
  6: 'chashaorou.jpg',
  7: 'chiyouji.jpg',
  8: 'danchaofan.jpg',
  9: 'danta.jpg',
  10: 'dongguapaigutang.jpg',
  11: 'dongguayimitang.jpg',
  12: 'haidai paigutang.jpg',
  13: 'laomujitang.jpg',
  14: 'paiguanggua.jpg',
  15: 'ruzhu.jpg',
  16: 'shaguozhou.jpg',
  17: 'shaomai.jpg',
  18: 'mifan.jpg',
  19: 'xiajiao.jpg'
};

Page({
  data: {
    keyword: '',
    categoryId: '',
    dishList: [],
    categories: [],
    currentCategoryName: '全部',
    pagination: {
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    loading: false,
    hasMore: true
  },

  onLoad(options) {
    if (options.categoryId) {
      this.setData({ categoryId: options.categoryId });
    }
    this.loadCategories();
    this.loadDishList();
  },

  // 加载菜品分类
  loadCategories() {
    app.request({
      url: '/dish-category/list',
      data: { pageSize: 999 }
    }).then(data => {
      this.setData({ categories: data.records || [] });
      this.updateCategoryName();
    }).catch(err => {
      console.error('加载菜品分类失败', err);
    });
  },

  // 更新当前分类名称
  updateCategoryName() {
    const { categories, categoryId } = this.data;
    if (!categoryId) {
      this.setData({ currentCategoryName: '全部' });
      return;
    }
    
    const category = categories.find(cat => cat.id == categoryId);
    this.setData({ currentCategoryName: category ? category.categoryName : '全部' });
  },

  // 加载菜品列表
  loadDishList() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });

    app.request({
      url: '/dish/list',
      data: {
        pageNum: this.data.pagination.pageNum,
        pageSize: this.data.pagination.pageSize,
        keyword: this.data.keyword,
        categoryId: this.data.categoryId
      }
    }).then(data => {
      // 处理图片URL，使用本地图片
      const processedRecords = data.records.map(dish => {
        const imageName = dishImageMap[dish.id];
        return {
          ...dish,
          image: imageName ? `/images/dishes/${imageName}` : '/images/common/icon_search.png'
        };
      });
      const newDishList = this.data.pagination.pageNum === 1 ? processedRecords : [...this.data.dishList, ...processedRecords];
      const hasMore = newDishList.length < data.total;

      this.setData({
        dishList: newDishList,
        'pagination.total': data.total,
        hasMore: hasMore,
        loading: false
      });
    }).catch(err => {
      console.error('加载菜品列表失败', err);
      this.setData({ loading: false });
    });
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  // 搜索提交
  onSearch() {
    this.setData({
      'pagination.pageNum': 1,
      dishList: [],
      hasMore: true
    });
    this.loadDishList();
  },

  // 分类筛选
  onCategoryChange(e) {
    this.setData({
      categoryId: e.detail.value,
      'pagination.pageNum': 1,
      dishList: [],
      hasMore: true
    });
    this.updateCategoryName();
    this.loadDishList();
  },

  // 查看菜品详情
  onDishTap(e) {
    const dishId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish/detail/detail?id=${dishId}`
    });
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ 'pagination.pageNum': this.data.pagination.pageNum + 1 });
      this.loadDishList();
    }
  }
});