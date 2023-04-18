<template>
    <div id="account">
      <div v-show="userDataIsReady" id="settings_content">
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
          <div class="setting">
            <div style="margin-right: 0.2em">
                Nickname:
            </div>
            <div style="width: 8em; text-align: center; border-bottom: 1px solid" :title="nickname">
                <p style="overflow: hidden; text-overflow: ellipsis; margin: 0em">
                {{nickname}}
                <Skeleton v-show="!nickname" style="padding: 0.6em 0px" />
                </p>
            </div>
            <Button class="p-button-text" icon="pi pi-pencil" title="Change nickname"
                @click="showChangeNicknameDialog" />
          </div>
          <div class="setting">
            <Button class="p-button-link" label="Change password" style="padding: 0em"
                @click="showChangePasswordDialog" />
          </div>
          <div class="setting">
            <Button class="p-button-text p-button-danger" label="Delete account"
                style="padding: 0em"
                @click="showDeleteAccountDialog" />
          </div>
      </div>
    </div>
  
    <Dialog v-model:visible="changeNicknameDialogVisible"
      header="Change nickname" :modal="true" :draggable="false">
      <InputText v-model="new_nickname" placeholder="New nickname" autofocus
         @keydown.enter="change_nickname" />
          <template #footer>
              <Button label="Apply" :disabled="new_nickname.length == 0"
                  @click="change_nickname" />
          </template>
      </Dialog>
  
    <Dialog v-model:visible="changePasswordDialogVisible"
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
      </Dialog>
  
    <Dialog v-model:visible="deleteAccountDialogVisible"
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
      </Dialog>
  </template>
  
  <script>
  import { mapActions, mapGetters } from "vuex"
  import Skeleton from 'primevue/skeleton'
  export default {
    name: "v-acount",
    components: {
      Skeleton
    },
    created() {
    },
    data() {
      return {
        userDataIsReady: true, //false,
        photo: null,
        nickname: "test", //
        changeNicknameDialogVisible: false,
        new_nickname: "",
        showOnlineStatus: true,
        changePasswordDialogVisible: false,
        current_password: "",
        new_password: "",
        repeat_new_password: "",
        deleteAccountDialogVisible: false,
        agree: false
      }
    },
    methods: {
      async loadUserData() {
        let user_info_response = await this.makeRequest("/get_user_info")
        if (user_info_response && user_info_response.status == 200) {
          let data = await user_info_response.json()
          this.nickname = data["nickname"]
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
      async change_nickname() {
        if (this.new_nickname.length < 4) {
          this.$toast.add({
            severity: "error",
            summary: "Short nickname",
            detail: "The nickname must consist at least of 4 characters",
            life: 5000
          })
          return
        }
        let response = await this.makeRequest(
          "/update_nickname",
          {"new_nickname": this.new_nickname},
          "PATCH"
        )
        if (response.status == 201) {
          this.nickname = this.new_nickname
        }
        this.changeNicknameDialogVisible = false
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
          this.changePasswordDialogVisible = false
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
        this.deleteAccountDialogVisible = false
      },
      showChangeNicknameDialog() {
        this.new_nickname = this.nickname
        this.changeNicknameDialogVisible = true
      },
      showChangePasswordDialog() {
        this.current_password = ""
        this.new_password = ""
        this.repeat_new_password = ""
        this.changePasswordDialogVisible = true
      },
      showDeleteAccountDialog() {
        this.current_password = ""
        this.agree = false
        this.deleteAccountDialogVisible= true
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
  