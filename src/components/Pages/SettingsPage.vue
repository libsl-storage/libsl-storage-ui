<template>
    <div id="account">
      <div v-show="userDataIsReady" id="settings_content">
          <div class="setting">
            <div style="margin-right: 0.2em">
                Username:
            </div>
            <div style="width: 8em; text-align: center; border-bottom: 1px solid" :title="username">
                <p style="overflow: hidden; text-overflow: ellipsis; margin: 0em">
                {{username}}
                <Skeleton v-show="!username" style="padding: 0.6em 0px" />
                </p>
            </div>
            <Button class="p-button-text" icon="pi pi-pencil" title="Change username"
                @click="showChangeUsernamePopUp" />
          </div>
          <div class="setting">
            <Button class="p-button-link" label="Change password" style="padding: 0em"
                @click="showChangePasswordPopUp" />
          </div>
          <div class="setting">
            <Button class="p-button-text p-button-danger" label="Delete account"
                style="padding: 0em"
                @click="showDeleteAccountPopUp" />
          </div>
      </div>
    </div>
  
    <PopUp v-model:visible="changeUsernamePopUpVisible"
      header="Change username" :modal="true" :draggable="false">
      <InputText v-model="new_username" placeholder="New username" autofocus
         @keydown.enter="change_username" />
          <template #footer>
              <Button label="Apply" :disabled="new_username.length == 0"
                  @click="change_username" />
          </template>
    </PopUp>
  
    <PopUp v-model:visible="changePasswordPopUpVisible"
          header="Change password" :modal="true" :draggable="false">
      <div style="display: flex; flex-flow: column" @keydown.enter="change_password">
        <Password v-model="current_password" style="margin-bottom: 0.5em"
          placeholder="Current password" :feedback="false" :toggleMask="true" />
        <Password v-model="new_password" style="margin-bottom: 0.5em"
          placeholder="New password" :feedback="false" :toggleMask="true" />
        <Password v-model="repeat_new_password" style="margin-bottom: 0.5em"
          placeholder="Repeat new password" :feedback="false" :toggleMask="true" />
      </div>
      <template #footer>
              <Button label="Apply" :disabled="!isDataValid" @click="change_password" />
          </template>
    </PopUp>
  
    <PopUp v-model:visible="deleteAccountPopUpVisible"
          header="Delete account" :modal="true" :draggable="false">
      <div style="display: flex; flex-flow: column">
        <div style="display: flex; justify-content: center">
          <Password v-model="current_password" placeholder="Password"
            :feedback="false" :toggleMask="true" />
        </div>
        <div style="display: flex; align-items: center; margin-top: 2em">
          <div style="flex: 1; margin-right: 1em; width: 16em">
            I understand that my data stored on the server will be permanently deleted
          </div>
          <Checkbox v-model="agree" :binary="true" />
        </div>
      </div>
          <template #footer>
              <Button label="Delete" class="p-button-danger" :disabled="!agree"
                  @click="delete_account" />
          </template>
    </PopUp>
  </template>
  
  <script>
  import { mapActions, mapGetters } from "vuex"
  import Skeleton from 'primevue/skeleton'
  export default {
    name: "v-settings",
    components: {
      Skeleton
    },
    created() {
    },
    data() {
      return {
        userDataIsReady: true, //false,
        photo: null,
        username: "test", //
        changeUsernamePopUpVisible: false,
        new_username: "",
        showOnlineStatus: true,
        changePasswordPopUpVisible: false,
        current_password: "",
        new_password: "",
        repeat_new_password: "",
        deleteAccountPopUpVisible: false,
        agree: false
      }
    },
    methods: {
      async loadUserData() {
        let user_info_response = await this.makeRequest("/get_user_info")
        if (user_info_response && user_info_response.status == 200) {
          let data = await user_info_response.json()
          this.username = data["username"]
          this.showOnlineStatus = data["status"] == true
  
          let photo_response = await this.makeRequest("/get_user_photo")
          if (photo_response.status == 200)
            this.photo = URL.createObjectURL(new Blob([await photo_response.arrayBuffer()], {type: 'image/jpeg'}))
        }
      },
      openFileChooser() {
        document.getElementById("selectPhoto").click();
      },
      async onFileChange(e) {
        let files = e.target.files || e.dataTransfer.files
        let response = await this.makeRequest(
          "/update_photo",
          {"photo": files[0]},
          "PATCH"
        )
        if (response && response.status == 201) {
          this.photo = URL.createObjectURL(files[0])
        } else {
          this.$toast.add({severity: "error", summary: await response.text(), life: 5000})
        }
      },
      async resetPhoto() {
        let response = await this.makeRequest("/delete_photo", {}, "DELETE")
        if (response && response.status == 200) {
          this.photo = null
          document.getElementById("selectPhoto").value = ""
        }
      },
      async change_username() {
        if (this.new_username.length < 4) {
          this.$toast.add({
            severity: "error",
            summary: "Short username",
            detail: "The username must consist at least of 4 characters",
            life: 5000
          })
          return
        }
        let response = await this.makeRequest(
          "/update_username",
          {"new_username": this.new_username},
          "PATCH"
        )
        if (response.status == 201) {
          this.username = this.new_username
        }
        this.changeUsernamePopUpVisible = false
      },
      async change_password() {
        if (this.checkPasswordSecurity()) {
          let response = await this.makeRequest(
            "/update_password",
            {"current_password": this.current_password, "new_password": this.new_password},
            "PATCH"
          )
          if (response.status == 201)
            this.$toast.add({severity: "info", summary: "Password updated", life: 5000})
          else
            this.$toast.add({severity: "error", summary: await response.text(), life: 5000})
          this.changePasswordPopUpVisible = false
        }
      },
      async delete_account() {
        let response = await this.makeRequest(
          "/delete_account",
          {"password": this.current_password},
          "DELETE"
        )
        if (response.status == 200) {
          this.$toast.add({severity: "info", summary: "Account deleted", life: 5000})
          sessionStorage.setItem("authenticated", false)
          this.$router.replace({"path": "/"})
        }
        else {
          this.$toast.add({severity: "error", summary: await response.text(), life: 5000})
        }
        this.deleteAccountPopUpVisible = false
      },
      showChangeUsernamePopUp() {
        this.new_username = this.username
        this.changeUsernamePopUpVisible = true
      },
      showChangePasswordPopUp() {
        this.current_password = ""
        this.new_password = ""
        this.repeat_new_password = ""
        this.changePasswordPopUpVisible = true
      },
      showDeleteAccountPopUp() {
        this.current_password = ""
        this.agree = false
        this.deleteAccountPopUpVisible= true
      },
      checkPasswordSecurity() {
        let success = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(this.new_password)
        if (!success) {
          this.$toast.add({severity: "error", summary: "Weak password",
            detail: "The password must consist of at least 8 characters, at least one lowercase, one uppercase and one digit",
            life: 10000})
        }
        return success
      },
      ...mapActions([
  
      ])
    },
    computed: {
      isDataValid() {
        return this.current_password != "" && this.new_password != "" &&
          this.new_password == this.repeat_new_password
      },
      ...mapGetters([
        "isMobile"
      ])
    },
    watch: {
      showOnlineStatus() {
        this.makeRequest(
          "/update_show_online_status",
          {"new_status": this.showOnlineStatus},
          "PATCH"
        )
      }
    }
  }
  </script>
  
  <style scoped>
  #account {
    display: flex;
    justify-content: center;
    flex: 1;
    margin: 1em;
    overflow: auto;
  }
  
  #photo {
    border: 1px solid black;
    width: 100px;
    height: 100px;
  }
  
  .setting {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
  }
  </style>
  