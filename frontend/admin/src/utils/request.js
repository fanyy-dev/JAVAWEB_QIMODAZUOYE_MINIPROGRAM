import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    console.error('请求错误', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    if (res.code !== 200) {
      // 如果是401错误，打印日志便于调试
      if (res.code === 401) {
        console.error('401错误 - 请求路径:', response.config.url)
        console.error('401错误 - token:', localStorage.getItem('token'))
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/login')
        return Promise.reject(new Error(res.message || '未登录或登录已过期'))
      }
      
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 3000
      })
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res.data
  },
  error => {
    console.error('网络请求错误:', error)
    ElMessage({
      message: error.message || '网络错误',
      type: 'error',
      duration: 3000
    })
    return Promise.reject(error)
  }
)

export default service
