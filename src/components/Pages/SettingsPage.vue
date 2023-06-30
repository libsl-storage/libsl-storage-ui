<template>
    <div id="account">
      <div id="settings_content">
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
            <div style="margin-right: 0.2em">
                Email:
            </div>
            <div style="flex: 1; text-align: center; border-bottom: 1px solid" :title="email">
                <p style="overflow: hidden; text-overflow: ellipsis; margin: 0em">
                {{email}}
                <Skeleton v-show="!email" style="padding: 0.6em 0px" />
                </p>
            </div>
          </div>
          <div class="setting">
            <Button class="p-button-link" label="Change password" style="padding: 0em"
                @click="showChangePasswordPopUp" />
          </div>
          <!--
          <div class="setting">
            <Button class="p-button-text p-button-danger" label="Delete account"
                style="padding: 0em"
                @click="showDeleteAccountPopUp" />
          </div>-->
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
    mounted() {
      this.loadUserData()
    },
    data() {
      return {
        username: "",
        email: "",
        changeUsernamePopUpVisible: false,
        new_username: "",
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
        let user_info_response = await this.makeRequest("/account", "GET")
        if (user_info_response.status == 200) {
          let data = await user_info_response.json()
          this.username = data["name"]
          this.email = data["email"]
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
        let response = await this.makeRequest("/account", "POST", {
          "name": this.new_username
        })
        if (response.status == 200) {
          this.username = this.new_username
        }
        this.changeUsernamePopUpVisible = false
      },
      async change_password() {
        if (this.checkPasswordSecurity()) {
          let response = await this.makeRequest("/account/updatePassword", "POST", {
          "oldPassword": this.current_password,
          "newPassword": this.new_password
        })
          if (response.status == 200) {
            this.$toast.add({severity: "info", summary: "Password updated", life: 5000})
          } else if (response.status == 403) {
            this.$toast.add({severity: "error", summary: "Invalid current password", life: 5000})
          }
          this.changePasswordPopUpVisible = false
        }
      },
      checkPasswordSecurity() {
        let success = this.new_password.length == 0 || this.new_password.length >= 8
        if (!success) {
          this.$toast.add({severity: "error", summary: "Weak password",
            detail: "The password must consist of at least 8 characters",
            life: 10000})
        }
        return success
      },
      async delete_account() {
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
  