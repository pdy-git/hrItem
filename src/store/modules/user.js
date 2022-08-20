import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    },
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = JSON.parse(JSON.stringify(userInfo))
    },
    // 删除用户信息
    reomveUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 通过接口获取token
    // commit setToken
    async login({ commit }, data) {
      const res = await login(data)
      console.log(res)
      commit('setToken', res)

      // 拿到token说明登录成功
      // setTimeStamp() // 设置当前时间戳
    },
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      const baseInfo = await getUserDetailById(res.userId)
      const baseResult = { ...res, ...baseInfo }
      commit('setUserInfo', baseResult)
      return baseResult
    },
    logout({ commit }) {
      commit('removeToken')
      commit('reomveUserInfo')
    }

  }

}
