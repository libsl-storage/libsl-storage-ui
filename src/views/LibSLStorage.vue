<template>
    <div id="libsl-storage">
        <div id="header">
            <div id="header-left" />
            <div id="header-title">LibSL Storage</div>
            <div id="header-right">
                <Button title="Sign in" icon="pi pi-user" rounded outlined style="color: white"
                    @click="sign_in" />
            </div>
        </div>
        <div id="main">
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    name: "v-libsl-storage",
    methods: {
        sign_in() {
            this.$router.push({path: "/sign-in"})
        }
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

#header-left {
    display: flex;
    flex: 1;
}

#header-title {
    display: flex;
    align-items: center;
}

#header-right {
    display: flex;
    flex: 1;
    justify-content: right;
}

#main {
    display: flex;
    flex: 1;
    background-color: rgb(245, 245, 245); /* #eff3f8; */
    overflow: auto;
}
</style>