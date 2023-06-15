<template>
    <div id="dir-chooser">
        <div id="dir-list">
            <DirItem v-for="item in content" :key="item.id"
                :path="item" :selectedPath="selectedPath" @setPath="(path) => {selectedPath = path}" />
        </div>
        <div id="footer">
            <Button label="New folder" class="p-button-link" style="padding: 0em"
                @click="newFolderPopUpVisible = true" />
            <Button label="Ok" @click="$emit('setPath', selectedPath)" />
        </div>
    </div>

    <PopUp v-model:visible="newFolderPopUpVisible" header="Create folder" :modal="true" :draggable="false">
        <InputText v-model="newFolderName" placeholder="Folder name" autofocus />
        <template #footer>
            <Button label="Create" :disabled="newFolderName.length == 0" />
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
    emits: ["setPath"],
    data() {
        return {
            content: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'a', 'b', "c", "d", "e", "f"],
            selectedPath: "",
            newFolderPopUpVisible: false,
            newFolderName: ""
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