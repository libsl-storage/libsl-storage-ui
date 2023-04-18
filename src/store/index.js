import { createStore } from 'vuex'

export default createStore({
  state: {
    isDesktop: navigator.userAgent.search(/iPhone|Android/) == -1,
    isAuthenticated: true
  },
  getters: {
    isDesktop(state) {
      return state.isDesktop
    },
    isMobile(state) {
      return !state.isDesktop
    },
    isAuthenticated(state) {
      return state.isAuthenticated
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
