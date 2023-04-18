<template>
    <div id="libsl-storage">
        <div id="header">
            <div id="title" @click="$router.push({path: '/'})">LibSL Storage</div>
            <div id="user">
                <div v-if="isAuthenticated" style="display: flex; align-items: center; cursor: pointer" 
                    @click="account_pop_up_menu_toggle">
                    <Button icon="pi pi-user" rounded outlined style="color: white" />
                    <i class="pi pi-angle-down" />
                </div>
                <div v-else>
                    <Button icon="pi pi-user" label="Sign in" rounded outlined style="color: white"
                        @click="sign_in" />
                </div>
                <Menu ref="menu" :model="items" :popup="true" />
            </div>
        </div>
        <div id="main">
            <router-view />
        </div>
    </div>

    <Dialog :visible="signOutConfirmDialogVisible" @keydown.esc="signOutConfirmDialogVisible = false"
		:modal="true" :closable="false" :draggable="false">
		Are you sure you want to sign out?
		<template #footer>
			<Button label="No" icon="pi pi-times" class="p-button-text"
				@click="signOutConfirmDialogVisible = false" />
			<Button label="Yes" icon="pi pi-check" autofocus />
		</template>
	</Dialog>
</template>

<script>
import Menu from 'primevue/menu'
import { mapGetters } from "vuex"
export default {
    name: "v-libsl-storage",
    components: {
        Menu
    },
    data() {
        return {
            items: [
                {
                    icon: "pi pi-plus",
                    label: "New spec",
                    command: () => {
                        this.$router.push({"path": "/new-specification"})
                    }
                },
                {
                    icon: "pi pi-cog",
                    label: "Settings",
                    command: () => {
                        this.$router.push({"path": "/account"})
                    }
                },
                {
                    separator: true 
                },
                {
                    icon: "pi pi-sign-out",
                    label: "Sign Out",
                    command: () => {
                        this.signOutConfirmDialogVisible = true
                    }
                }
            ],
            signOutConfirmDialogVisible: false
        }
    },
    methods: {
        sign_in() {
            this.$router.push({path: "/sign-in"})
        },
        account_pop_up_menu_toggle(event) {
            this.$refs.menu.toggle(event)
        }
    },
    computed: {
        ...mapGetters([
            "isAuthenticated"
        ])
    }
}
</script>

<style scoped>
#libsl-storage {
    display: flex;
    flex-flow: column;
    flex: 1;
}

#header {
    z-index: 1;
    display: flex;
    padding: 0.5em;
    background-color: rgb(50, 56, 62);
    box-shadow: 0px 1px 5px grey;
    color: white;
}

#title {
    display: flex;
    flex: 1;
    align-items: center;
    cursor: pointer;
}

#user {
    display: flex;
}

#main {
    display: flex;
    flex: 1;
    background-color: rgb(245, 245, 245); /* #eff3f8; */
    overflow: auto;
}
</style>