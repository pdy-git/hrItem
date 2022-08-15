import testIndex from './testIndex'
import testIndex2 from './testIndex2'

// const com = [testIndex, testIndex2]

// 1.
// export default {
// install: (Vue) => {
//   Vue.component('testIndex', testIndex)
//   Vue.component('testIndex2', testIndex2)
// }
// }

// 2.
// vue.use(函数)
// export default (Vue) => {
//   Vue.component('testIndex', testIndex)
//   Vue.component('testIndex2', testIndex2)
// }

//3.
// export default (Vue) => {
//   com.forEach(ele => {
//     Vue.component(ele.name, ele)
//   })
// }
