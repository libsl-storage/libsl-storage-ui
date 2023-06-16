<template>
  <div id="sign_in">
    <div id="sign_in_panel">
      <div style="display: flex; flex-flow: column" @keydown.enter="sign_in">
        <form>
          <div style="margin-top: 1.5em">
            <span class="p-float-label">
              <InputText v-model="email" id="username" name="email" type="email" autocomplete="username"
                style="width: 14em" autofocus />
              <label for="username">Email</label>
            </span>
          </div>
          <div style="margin-top: 1.5em">
            <span class="p-float-label">
              <Password v-model="password" id="password" name="password" type="password" autocomplete="current-password"
                :inputStyle="{'width': '14em'}" :toggleMask="true" :feedback="false" />
              <label for="password">Password</label>
            </span>
          </div>
        </form>
      </div>
      <div style="display: flex; flex: 1; justify-content: center; margin-top: 1em">
        <Button label="Sign in" class="p-button-raised" style="width: 100%"
          :disabled="email == '' || password == ''" @click="sign_in" />
      </div>
      <div style="display: flex; margin-top: 1em">
        <div style="display: flex; flex: 1; align-items: center;">
          <div style="flex: 1; border-top: 1px solid lightgrey" />
        </div>
        <div style="margin: 0em 0.5em">or</div>
        <div style="display: flex; flex: 1; align-items: center;">
          <div style="flex: 1; border-top: 1px solid lightgrey" />
        </div>
      </div>
      <div style="display: flex; justify-content: space-around; margin-top: 0.5em">
        <Button icon="pi sign-in-with-google-icon" label="Google" text />
        <Button icon="pi sign-in-with-github-icon" label="GitHub" text />
      </div>
      <div style="display: flex; flex: 1; justify-content: center; margin-top: 0.6em">
        <Button label="Create account" class="p-button-link" style="padding: 0.1em"
          @click="sign_up"/>
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
      email: "",
      password: ""
    }
  },
  methods: {
    async sign_in() {
      let r = await this.makeRequest("/auth/login", "POST", {
        "email": this.email,
        "password": this.password
      })
      if (r.status == 200) {
        this.$router.replace({"path": "/"})
        this.setAuth(true)
      } else if (r.status == 400) {
        this.$toast.add({severity: "error", summary: "Authentication failed", life: 5000})
        this.login = ""
        this.password = ""
      }
    },
    sign_up() {
      this.$router.push({ path: "/sign-up" })
    },
    ...mapActions([
      "setAuth"
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
  padding: 1.5em;
	background-color: white;
	box-shadow: 1px 1px 4px #808080;
  border-radius: 10px;
}

.sign-in-with-google-icon {
  background: url("@/assets/sign_in_with_google.svg");
  height: 18px;
  width: 18px;
}

.sign-in-with-github-icon {
  background: url("@/assets/sign_in_with_github.svg");
  height: 18px;
  width: 18px;
}
</style>
