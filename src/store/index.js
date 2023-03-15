import { createStore } from 'vuex'

export default createStore({
  state: {
    isDesktop: navigator.userAgent.search(/iPhone|Android/) == -1,
  },
  getters: {
    isDesktop(state) {
      return state.isDesktop
    },
    isMobile(state) {
      return !state.isDesktop
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
