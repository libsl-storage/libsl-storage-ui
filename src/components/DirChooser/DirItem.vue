<template>
    <div class="dir-item">
        <div class="dir">
            <div :class="expanded ? 'pi pi-angle-down' : 'pi pi-angle-right'" @click="expanded=!expanded" />
            <div style="display: flex; flex: 1; align-items: center;" @click="$emit('setDir', getCurrentPath)">
                <div class="pi pi-folder" style="margin-left: 0.3em; margin-right: 0.3em" />
                <div>{{ dirName }}</div>
                <div v-show="isCurrentDir" class="pi pi-check-circle"
                    style="color: green; font-weight: bold; margin-left: 0.2em" />
            </div>
        </div>
        <div class="dir-content" v-if="expanded">
            <!-- <v-dir-item v-for="item in content" :key="item.id" /> -->
            <v-dir-item :parent="getCurrentPath" dirName="nested" :currentDir="currentDir" @setDir="setDir" />
        </div>
    </div>
</template>

<script>
export default {
    name: "v-dir-item",
    props: {
        parent: String,
        dirName: String,
        currentDir: String
    },
    emits: ["setDir"],
    data() {
        return {
            expanded: false
        }
    },
    methods: {
        setDir(path) {
            this.$emit("setDir", path)
        }
    },
    computed: {
        isCurrentDir() {
            return this.currentDir == this.getCurrentPath
        },
        getCurrentPath() {
            return `${this.parent}/${this.dirName}`
        }
    }
}
</script>

<style scoped>
.dir-item {
    display: flex;
    flex-flow: column;
    cursor: pointer;
    padding-top: 0.5em
}

.dir {
    display: flex;
    align-items: center;
}

.selected {
    color: green;
}

.dir-content {
    padding-left: 1.2em;
}
</style>