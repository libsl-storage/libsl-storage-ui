<template>
  <div id="sign_up">
    <div id="sign_up_panel">
      <div style="display: flex; flex-flow: column" @keydown.enter="sign_up">
        <div style="display: flex; justify-content: center; margin-bottom: 1em">
          <strong>Create Account</strong>
        </div>
        <div style="padding-bottom: 1em">
          <div style="display: flex; justify-content: center; padding-bottom: 0.5em">
            <img v-if="photo==null" id="photo" src="@/assets/blank_user_photo.jpg">
            <img v-else id="photo" :src="photo" />
          </div>
          <div style="display: flex; justify-content: center; align-items: center">
            <input id="selectPhoto" accept="image/png,image/jpeg" type="file" @change="onFileChange"
              style="display: none" />
            <Button label="Browse" icon="pi pi-camera" class="p-button-raised p-button-rounded"
              @click="openFileChooser" />
            <Button icon="pi pi-trash" :disabled="photo==null" style="margin-left: 0.5em"
              class="p-button-raised p-button-rounded p-button-danger"
              @click="resetPhoto" />
          </div>
        </div>
        <div style="margin-bottom: 0.4em">
          <InputText v-model="nickname" placeholder="Nickname" style="width: 14em" />
        </div>
        <div style="margin-bottom: 0.4em">
          <InputText v-model="login" placeholder="Login" style="width: 14em" />
        </div>
        <div style="margin-bottom: 0.4em">
          <Password v-model="password" placeholder="Password" :feedback="false" :toggleMask="true" :inputStyle="{'width': '14em'}" />
        </div>
        <div style="margin-bottom: 0.4em">
          <Password v-model="repeat_password" placeholder="Repeat Password" :feedback="false" :toggleMask="true" :inputStyle="{'width': '14em'}" />
        </div>
      </div>
      <div style="display: flex; margin-top: 0.6em">
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
      photo_path : null,
      photo: null,
      nickname: "",
      login: "",
      password: "",
      repeat_password: ""
    }
  },
  methods: {
    openFileChooser() {
      document.getElementById("selectPhoto").click()
    },
    async onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files
      if (files[0].size <= 512 * 1024) {
        this.photo_path = files[0]
        this.photo = URL.createObjectURL(this.photo_path)
      } else {
        this.resetPhoto()
        this.$toast.add({severity: "error", summary: "Inappropriate photo",
          detail: "File is too big",
          life: 5000})
      }
    },
    resetPhoto() {
      document.getElementById("selectPhoto").value = ""
      this.photo_path = null
      this.photo = null
    },
    sign_in() {
      this.$router.push({path: "/sign-in"})
    },
    async sign_up() {
      if (this.nickname.length < 4) {
        this.$toast.add({severity: "error", summary: "Short nickname",
          detail: "The nickname must consist at least of 4 characters",
          life: 10000})
        return
      }
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(this.password)) {
        this.$toast.add({severity: "error", summary: "Weak password",
          detail: "The password must consist of at least 8 characters, at least one lowercase, one uppercase and one digit",
          life: 10000})
        return
      }
      let formData = new FormData()
      formData.append("login", this.login)
      let r = await fetch("/check_login_existence", {
        method: "POST", body: formData
      })
      if (r.status == 200) {
        formData.append("password", this.password)
        formData.append("nickname", this.nickname)
        if (this.photo_path)
          formData.append("photo", this.photo_path)
        r = await fetch("/registration", {
          method: "POST", body: formData
        })
        if (r.status == 200) {
          sessionStorage.setItem("authenticated", true)
          this.$router.replace({"path": "/dashboard/messenger"})
        }
      } else if (r.status == 409) {
        this.$toast.add({severity: "error",
          detail: "This login already exists",
          life: 5000})
        this.login = ""
      }
    },
    ...mapActions([
      "tokenHandler"
    ])
  },
  computed: {
    isDataValid() {
      return this.login != "" && this.nickname != "" &&
        this.password != "" && this.password == this.repeat_password
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

#photo {
  border: 1px solid black;
  width: 100px;
  height: 100px;
}
</style>
