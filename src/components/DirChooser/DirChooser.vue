<template>
    <div id="dir-chooser">
        <div id="dir-list">
            <div v-show="content.children != null && content.children.length == 0"
                style="display: flex; justify-content: center; color: grey">
                Empty
            </div>
            <DirItem v-for="item in content.children" :key="item.id"
                :dirId="item.id" :path="item.name" :selectedPath="selectedPath"
                @select="selectDirHandler" />
        </div>
        <div id="footer">
            <Button label="New folder" class="p-button-link" style="padding: 0em"
                @click="newFolderName = ''; newFolderPopUpVisible = true" />
            <Button label="Ok" @click="$emit('select', {'dirId': selectedDirId, 'path': selectedPath})" />
        </div>
    </div>

    <PopUp v-model:visible="newFolderPopUpVisible" header="New folder" :modal="true" :draggable="false">
        <InputText v-model="newFolderName" placeholder="Name" autofocus />
        <template #footer>
            <Button label="Create" :disabled="newFolderName.length == 0" @click="createDir" />
        </template>
    </PopUp>
</template>

<script>
import DirItem from '@/components/DirChooser/DirItem.vue'
export default {
    name: "v-dir-chooser",
    components: {
        DirItem
    },
    emits: ["select"],
    mounted() {
        this.fetchDirContent()
    },
    data() {
        return {
            content: [],
            selectedPath: "",
            selectedDirId: null,
            newFolderPopUpVisible: false,
            newFolderName: ""
        }
    },
    methods: {
        async fetchDirContent() {
            let r = await this.makeRequest("/directory/children", "GET")
            this.content = await r.json()
        },
        selectDirHandler(data) {
            if (data.id == this.selectedDirId) {
                this.selectedDirId = null
                this.selectedPath = ""
            } else {
                this.selectedDirId = data.id
                this.selectedPath = data.path
            }
        },
        async createDir() {
            let r = await this.makeRequest("/directory", "POST", {
                "name": this.newFolderName,
                "parentId": this.selectedDirId
            })
            if (r.status == 201) {
                await this.fetchDirContent()
            } else if (r.status == 400) {
                this.$toast.add({severity: "error", summary: "Such folder already exists", life: 5000})
            } else if (r.status == 403) {
                this.$toast.add({severity: "error", summary: "Only directory owner can create subdirectories", life: 5000})
            } else if (r.status == 404) {
                this.$toast.add({severity: "error", summary: "Specified parent directory not exists", life: 5000})
            }
            this.newFolderPopUpVisible = false
        }
    }
}
</script>

<style scoped>
#dir-chooser {
    display: flex;
    flex-flow: column;
    min-width: 12em;
    overflow: hidden;
}

#dir-list {
    display: flex;
    flex-flow: column;
    flex: 1;
    border-radius: 10px;
    padding-bottom: 0.5em;
    overflow: auto;
}

#footer {
    display: flex;
    justify-content: space-between;
    margin-top: 1em;
    padding: 0.2em;
}
</style>