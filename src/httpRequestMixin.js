export default {
  methods: {
    async httpRequest(url, requestMethod, payload = {}) {
      let r = await fetch(url, {
        method: requestMethod,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (r.status == 401) {
        sessionStorage.setItem("authenticated", false)
      }
      return r
    }
  }
}
