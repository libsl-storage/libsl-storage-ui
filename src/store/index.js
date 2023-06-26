import { createStore } from 'vuex'

export default createStore({
  state: {
    isDesktop: navigator.userAgent.search(/iPhone|Android/) == -1,
    auth: false,
    filters: [],
    selectedFilters: [],
    searchResult: []
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
    },
    getFilters(state) {
      return state.filters
    },
    getSelectedFilters(state) {
      return state.selectedFilters
    },
    getSearchResult(state) {
      return state.searchResult
    }
  },
  mutations: {
    SET_AUTH(state, auth) {
      state.auth = auth
    },
    SET_FILTERS(state, filters) {
      state.filters = filters
    },
    SET_SELECTED_FILTERS(state, filters) {
      state.selectedFilters = filters
    },
    SET_SEARCH_RESULT(state, result) {
      state.searchResult = result
    }
  },
  actions: {
    setAuth({commit}, auth) {
      commit("SET_AUTH", auth)
    },
    setFilters({commit}, filters) {
      commit("SET_FILTERS", filters)
    },
    setSelectedFilters({commit}, filters) {
      commit("SET_SELECTED_FILTERS", filters)
    },
    setSearchResult({commit}, result) {
      commit("SET_SEARCH_RESULT", result)
    }
  },
})
