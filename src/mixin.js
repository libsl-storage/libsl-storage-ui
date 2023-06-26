export default {
  methods: {
    async makeRequest(url, method, payload = null) {
      let header = {}
      let body = null
      if (payload != null) {
        if (payload.constructor === ({}).constructor) {
          body = JSON.stringify(payload)
          header = {"Content-Type": "application/json"}
        } else {
          body = payload
        }
      }

      let r = await this.httpRequest(url, method, header, body)
      if (r.status == 401) { // access-token expired
        let refresh_r = await this.httpRequest("/auth/refresh", "POST")
        if (refresh_r.status == 200) {
          r = await this.httpRequest(url, method, header, body)
        }
      }
      return r
    },
    async httpRequest(url, method, header, body) {
      return await fetch(process.env.VUE_APP_ROOT_API + url, {
        method: method,
        credentials: "include",
        headers: header,
        body: body
      })
    }
  }
}
