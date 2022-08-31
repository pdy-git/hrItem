import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

// import components from '@/components' // 引入组件
// Vue.use(components) // 注册组件 会执行install的方法

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import * as directives from '@/directives'

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// 全局注册组件
import components from '@/components'
Vue.use(components)
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

import * as filters from '@/directives/filters'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
import Print from 'vue-print-nb'
Vue.use(Print)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
