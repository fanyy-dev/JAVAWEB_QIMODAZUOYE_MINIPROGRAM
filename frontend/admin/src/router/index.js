import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/layout/Index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '数据总览' }
      },
      {
        path: 'store/list',
        name: 'StoreList',
        component: () => import('@/views/store/List.vue'),
        meta: { title: '门店管理' }
      },
      {
        path: 'dish/list',
        name: 'DishList',
        component: () => import('@/views/dish/List.vue'),
        meta: { title: '菜品管理' }
      },
      {
        path: 'order/list',
        name: 'OrderList',
        component: () => import('@/views/order/List.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'user/list',
        name: 'UserList',
        component: () => import('@/views/user/List.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'category/list',
        name: 'CategoryList',
        component: () => import('@/views/category/List.vue'),
        meta: { title: '分类管理' }
      },
      {
        path: 'coupon/list',
        name: 'CouponList',
        component: () => import('@/views/coupon/List.vue'),
        meta: { title: '优惠券管理' }
      },
      {
        path: 'banner/list',
        name: 'BannerList',
        component: () => import('@/views/banner/List.vue'),
        meta: { title: '广告管理' }
      },
      {
        path: 'review/list',
        name: 'ReviewList',
        component: () => import('@/views/review/List.vue'),
        meta: { title: '评价管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path === '/login') {
    next()
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
