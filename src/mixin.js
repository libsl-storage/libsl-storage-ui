export default {
  methods: {
    async makeRequest(url, method, payload = null) {
      let body = payload ? JSON.stringify(payload) : null
      let r = await this.httpRequest(url, method, body)
      if (r.status == 403) { // 401 access-token expired
        let refresh_r = await this.httpRequest("/auth/refresh", "POST")
        if (refresh_r.status == 200) {
          r = await this.httpRequest(url, method, body)
        }
      }
      return r
    },
    async httpRequest(url, method, body) {
      return await fetch(process.env.VUE_APP_ROOT_API + url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: body
      })
    }
  }
}
