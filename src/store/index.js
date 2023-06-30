import { createStore } from 'vuex'
import mixin from '@/mixin'

export default createStore({
  state: {
    isDesktop: navigator.userAgent.search(/iPhone|Android/) == -1,
    auth: false,
    searchFilters: [],
    selectedFilters: [],
    searchResult: [],
    paginator: 0
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
    getSearchFilters(state) {
      return state.searchFilters
    },
    getSelectedFilters(state) {
      return state.selectedFilters
    },
    getSearchResult(state) {
      return state.searchResult
    },
    getPaginator(state) {
      return state.paginator
    }
  },
  mutations: {
    SET_AUTH(state, auth) {
      state.auth = auth
    },
    SET_SEARCH_FILTERS(state, filters) {
      state.searchFilters = filters
    },
    SET_SELECTED_FILTERS(state, filters) {
      state.selectedFilters = filters

      state.searchFilters.forEach((i) => {
        let selected = false
        state.selectedFilters.forEach((j) => {
          if (i.key == j.key) {
            selected = true
          }
        })
        if (!selected) i.value = ""
      })
    },
    SET_SEARCH_RESULT(state, result) {
      state.searchResult = result
    },
    SET_PAGINATOR(state, paginator) {
      state.paginator = paginator
    }
  },
  actions: {
    setAuth({commit}, auth) {
      commit("SET_AUTH", auth)
    },
    setSelectedFilters({commit}, filters) {
      commit("SET_SELECTED_FILTERS", filters)
    },
    setPaginator({commit}, paginator) {
      commit("SET_PAGINATOR", paginator)
    },
    async fetchSearchFilters({commit}) {
      let r = await mixin.methods.makeRequest("/specification/page/filters", "GET")
      let data = await r.json()
      let filters = []
      for (const item in data.keys) {
          filters.push({"title": data.keys[item].title, "key": data.keys[item].key, "value": ""})
      }
      commit("SET_SEARCH_FILTERS", filters)
  },
    async search({commit, state}, page_number) {
      let filter_list = []
      state.selectedFilters.forEach((item) => {
          filter_list.push({"key": item.key, "value": item.value})
      })
      let r = await mixin.methods.makeRequest("/specification/page", "POST", {
          "page": page_number,
          "filters": filter_list
      })
      let data = await r.json()
      commit("SET_SEARCH_RESULT", data)
    }
  }
})
