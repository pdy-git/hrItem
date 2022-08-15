import axios from 'axios'
import { Message } from 'element-ui'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url 环境变量
  timeout: 5000 // request timeout 超时时间 ，超过就请求失败
})

service.interceptors.request.use()
service.interceptors.response.use((response) => {
  const { success, message, data } = response.data
  if (success) {
    console.log(data)
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
