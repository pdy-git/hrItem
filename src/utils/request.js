import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url 环境变量
  timeout: 5000 // request timeout 超时时间 ，超过就请求失败
})

service.interceptors.request.use()
service.interceptors.response.use()

export default service
