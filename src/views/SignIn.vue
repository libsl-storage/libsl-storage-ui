<template>
  <div id="sign_in">
    <div id="sign_in_panel">
      <div style="display: flex; flex-flow: column" @keydown.enter="sign_in">
        <form>
          <div style="margin-bottom: 0.4em">
            <InputText v-model="login" name="email" type="email" autocomplete="username"
              placeholder="Login" style="width: 14em" autofocus />
          </div>
          <div style="margin-bottom: 0.4em">
            <Password v-model="password" name="password" type="password" autocomplete="current-password"
              placeholder="Password" inputStyle="width: 14em" :feedback="false" :toggleMask="true" />
          </div>
        </form>
      </div>
      <div style="display: flex; margin-top: 0.6em">
        <div style="display: flex; flex: 1">
          <Button label="Create account" class="p-button-link" style="padding: 0.1em"
            @click="sign_up"/>
        </div>
        <div>
          <Button label="Sign in" class="p-button-raised"
            :disabled="login == '' || password == ''" @click="sign_in" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
export default {
	name: "v-sign-in",
  data() {
    return {
      login: "",
      password: ""
    }
  },
  methods: {
    async sign_in() {
      let formData = new FormData()
      formData.set("login", this.login)
      formData.set("password", this.password)
      let r = await fetch("/authentication", {
        method: "POST", body: formData
      })
      if (r.status == 200) {
        sessionStorage.setItem("authenticated", true)
        this.$router.replace({"path": "/dashboard/messenger"})
      } else if (r.status == 401) {
        this.$toast.add({severity: "error", summary: "Authentication failed",
          detail: "Invalid username or password", life: 5000})
        this.login = ""
        this.password = ""
      }
    },
    sign_up() {
      this.$router.push({ path: "/sign-up" })
    },
    ...mapActions([
      "tokenHandler"
    ])
  }
}
</script>

<style>
#sign_in {
  display: flex;
  flex-flow: column;
  flex: 1;
  align-items: center;
  padding-top: 2.5em;
  background-color: #edeef0;
}

#sign_in_panel {
  padding: 2em 1.5em;
	background-color: white;
	box-shadow: 1px 1px 4px #808080;
  border-radius: 10px;
}
</style>
