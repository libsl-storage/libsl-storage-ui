<template>
  <div id="sign_up">
    <div id="sign_up_panel">
      <div style="display: flex; flex-flow: column" @keydown.enter="sign_up">
        <div style="display: flex; justify-content: center; margin-bottom: 1em">
          <strong>Create Account</strong>
        </div>
        <div style="display: flex; align-items: center; margin-top: 1.5em">
          <span class="p-float-label">
            <InputText v-model="username" id="username" style="width: 14em"/>
            <label for="username">Username</label>
          </span>
        </div>
        <div style="display: flex; align-items: center; margin-top: 1.5em">
          <span class="p-float-label">
            <InputText v-model="email" id="email" style="width: 14em"
              :class="{'p-invalid': !isEmailValid}" />
            <label for="email">Email</label>
          </span>
        </div>
        <div style="display: flex; align-items: center; margin-top: 1.5em">
          <span class="p-float-label">
            <Password v-model="password" id="password" :feedback="false" :toggleMask="true"
              :inputStyle="{'width': '14em'}" :class="{'p-invalid': !isPasswordValid}" />
            <label for="password">Password</label>
          </span>
        </div>
        <div style="display: flex; align-items: center; margin-top: 1.5em">
          <span class="p-float-label">
            <Password v-model="repeat_password" id="repeat-password" :feedback="false" :toggleMask="true"
              :inputStyle="{'width': '14em'}" :class="{'p-invalid': !isRepeatPasswordValid}" />
              <label for="repeat-password">Repeat password</label>
          </span>
        </div>
      </div>
      <div style="display: flex; margin-top: 1em">
        <div style="display: flex; flex: 1">
          <Button label="Sign in instead" class="p-button-link" style="padding: 0.1em"
            @click="sign_in" />
        </div>
        <div>
          <Button label="Sign up" class="p-button-raised" :disabled="!isDataValid" @click="sign_up" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
export default {
	name: "v-sign-up",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      repeat_password: ""
    }
  },
  methods: {
    sign_in() {
      this.$router.push({path: "/sign-in"})
    },
    async sign_up() {
      let r = await this.httpRequest("https://b8f5-31-134-188-21.ngrok-free.app/register", "POST", {
        "name": this.username,
        "email": this.email,
        "password": this.password
      })

      if (r.status == 200) {
          sessionStorage.setItem("authenticated", true)
          this.$router.replace({"path": "/dashboard/messenger"})
      } else {
        this.$toast.add({severity: "error", summary: "Registration failed", life: 5000})
      }
    },
    ...mapActions([
      
    ])
  },
  computed: {
    isEmailValid() {
      if (this.email.length == 0) return true
      return /(.)+@(.)+\.(.)+/.test(this.email)
    },
    isPasswordValid() {
      return this.password.length == 0 || this.password.length >= 8
    },
    isRepeatPasswordValid() {
      return this.repeat_password.length == 0 || this.password == this.repeat_password
    },
    isDataValid() {
      return this.username.length &&
        this.email.length && this.isEmailValid &&
        this.password.length && this.isPasswordValid &&
        this.repeat_password.length && this.isRepeatPasswordValid
    }
  }
}
</script>

<style>
#sign_up {
  display: flex;
  flex-flow: column;
  flex: 1;
  align-items: center;
  padding-top: 2.5em;
  background-color: #edeef0;
}

#sign_up_panel {
  padding: 2em 1.5em;
	background-color: white;
	box-shadow: 1px 1px 4px #808080;
  border-radius: 10px;
}
</style>
