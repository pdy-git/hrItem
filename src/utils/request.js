
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url 环境变量
  timeout: 5000 // request timeout 超时时间 ，超过就请求失败
})

// 请求拦截器里添加Authorization 字段
service.interceptors.request.use(config => {
  // console.log(config)
  if (store.getters.token) {
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
}
)
service.interceptors.response.use((response) => {
  const { success, message, data } = response.data
  if (success) {
    // console.log(data)
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, (err) => {
  Message.error(err.message || '')
  return Promise.reject(err)
}
)

export default service
