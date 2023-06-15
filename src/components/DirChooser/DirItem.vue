<template>
    <div class="dir-item">
        <div style="display: flex; align-items: center;">
            <div :class="expanded ? 'pi pi-angle-down' : 'pi pi-angle-right'" @click="expanded=!expanded" />
            <div :class="['dir', {'selected': isSelected}]" @click="$emit('setPath', path)">
                <div class="pi pi-folder" style="margin: 0em 0.3em" />
                <div class="dir-name">
                    {{ getDirName }}
                </div>
                <div v-show="isSelected" class="pi pi-check-circle"
                    style="font-weight: bold; margin-left: 0.5em" />
            </div>
        </div>
        <div v-if="expanded" style="padding-left: 1.2em">
            <v-dir-item v-for="item in content" :key="item.id"
                :path="getNestedPath(item)" :selectedPath="selectedPath"
                @setPath="(path) => {$emit('setPath', path)}" />
        </div>
    </div>
</template>

<script>
export default {
    name: "v-dir-item",
    props: {
        path: String,
        selectedPath: String
    },
    emits: ["setPath"],
    data() {
        return {
            expanded: false,
            content: ["nested1", "nested2"]
        }
    },
    methods: {
        getNestedPath(nestedName) {
            return `${this.path}/${nestedName}`
        },
    },
    computed: {
        getDirName() {
            let index = this.path.length - 1
            while (index > 0 && this.path[index - 1] != '/')
                index--
            return this.path.slice(index)
        },
        isSelected() {
            return this.path == this.selectedPath
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
    flex: 1;
    align-items: center;
}

.dir-name:hover {
    text-decoration: underline;
}

.selected {
    color: green;
}
</style>