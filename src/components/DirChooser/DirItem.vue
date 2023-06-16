<template>
    <div class="dir-item">
        <div style="display: flex; align-items: center;">
            <div :class="expanded ? 'pi pi-angle-down' : 'pi pi-angle-right'" @click="selectHandler" />
            <div :class="['dir', {'selected': isSelected}]" @click="$emit('select', {'id': dirId, 'path': path})">
                <div class="pi pi-folder" style="margin: 0em 0.3em" />
                <div class="dir-name">
                    {{ getDirName }}
                </div>
                <div v-show="isSelected" class="pi pi-check-circle"
                    style="font-weight: bold; margin-left: 0.5em" />
            </div>
        </div>
        <div v-if="expanded" style="padding-left: 1.2em">
            <v-dir-item v-for="item in content.children" :key="item.id"
                :dirId="item.id" :path="getNestedPath(item.name)" :selectedPath="selectedPath"
                @select="(data) => {$emit('select', {'id': data.id, 'path': data.path})}" />
        </div>
    </div>
</template>

<script>
export default {
    name: "v-dir-item",
    props: {
        dirId: Number,
        path: String,
        selectedPath: String
    },
    emits: ["select"],
    data() {
        return {
            expanded: false,
            content: []
        }
    },
    methods: {
        async selectHandler() {
            if (this.expanded) {
                this.expanded = false
            } else {
                let r = await this.makeRequest("/directory/children/" + this.dirId, "GET")
                this.content = await r.json()
                this.expanded = true
            }
        },
        getNestedPath(nestedName) {
            return `${this.path}/${nestedName}`
        }
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