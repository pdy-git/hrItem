// import PageTools from './PageTools'

// export default (Vue) => {
//   Vue.component('PageTools', PageTools)
// }

// 自动批量注册组件
const requireComponent = require.context('./', true, /\.vue$/)
const list = requireComponent.keys().map(ele => requireComponent(ele))
console.log(requireComponent)

export default (Vue) => {
  list.forEach((ele) => {
    Vue.component(ele.default.name, ele.default)
  })
}
