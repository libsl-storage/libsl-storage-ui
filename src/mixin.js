export default {
  methods: {
    async httpRequest(url, requestMethod, payload = null) {
      let body = payload ? JSON.stringify(payload) : null
      let r = await fetch(process.env.VUE_APP_ROOT_API + url, {
        method: requestMethod,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: body
      })

      /*
      if (r.status == 403) { // 401
        await fetch(process.env.VUE_APP_ROOT_API + "/auth/refresh", {
          method: "POST",
          credentials: 'include'
        })

        r = await fetch(process.env.VUE_APP_ROOT_API + url, {
          method: requestMethod,
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: body
        })
      }*/
      return r
    }
  }
}
