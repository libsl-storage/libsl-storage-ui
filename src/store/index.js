import { createStore } from 'vuex'

export default createStore({
  state: {
    isDesktop: navigator.userAgent.search(/iPhone|Android/) == -1,
    auth: false,
  },
  getters: {
    isDesktop(state) {
      return state.isDesktop
    },
    isMobile(state) {
      return !state.isDesktop
    },
    isAuthenticated(state) {
      return state.auth
    }
  },
  mutations: {
    SET_AUTH(state, auth) {
      state.auth = auth
    }
  },
  actions: {
    setAuth({commit}, auth) {
      commit("SET_AUTH", auth)
    }
  },
})
