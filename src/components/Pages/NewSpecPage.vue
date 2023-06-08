<template>
    <div id="new-spec">
        <div class="property">
            <InputText v-model="libName" placeholder="Lib name" style="width: 100%" autofocus />
        </div>
        <div class="property">
            <div style="flex: 1; margin-right: 1em">
                <InputText v-model="path" placeholder="Path" style="width: 100%" />
            </div>
            <Button icon="pi pi-folder-open" @click="dirChooserVisible = true" />
        </div>
        <div class="property">
            <InputText v-model="description" placeholder="Description" style="width: 100%" />
        </div>
        <div class="property">
            <InputText v-model="tags" placeholder="Tags" style="width: 100%" />
        </div>
        <div class="property" style="display: flex; flex-flow: column; flex: 1">
            <div style="display: flex; justify-content: right; margin-bottom: 0.5em">
                <input id="selectFile" type="file" @change="onFileChange" style="display: none" />
                <Button label="Browse" icon="pi pi-file" @click="openFileChooser" />
            </div>
            <LibSLCodeEditor :content="code" :readonly="false" :key="codeEditorComponentKey"/>
        </div>
        <div style="display: flex; justify-content: right;">
            <Button label="Cancel" icon="pi pi-times" severity="secondary" style="margin-right: 1em"
                @click="cancelPopUpVisible = true" />
            <Button label="Save" icon="pi pi-save" />
        </div>
    </div>

    <PopUp v-model:visible="dirChooserVisible" header="Choose folder" :modal="true" :draggable="false">
        <DirChooser @setDir="setPath"/>
    </PopUp>

    <PopUp v-model:visible="cancelPopUpVisible" header="New spec" :modal="true" :draggable="false">
        <div>
            Your changes will be lost. Are you sure you want to continue?
        </div>
        <template #footer>
            <Button label="No" @click="cancelPopUpVisible = false" />
            <Button label="Yes"/>
         </template>
    </PopUp>
</template>

<script>
import DirChooser from '@/components/DirChooser/DirChooser.vue'
import LibSLCodeEditor from '@/components/CodeEditor/LibSLCodeEditor.vue'
export default {
    name: "v-new-spec",
    components: {
        DirChooser,
        LibSLCodeEditor
    },
    data() {
        return {
            libName: "",
            path: "",
            tags: "",
            description: "",
            dirChooserVisible: false,
            codeEditorComponentKey: 0,
            code: "",
            cancelPopUpVisible: false
        } 
    },
    methods: {
        setPath(path) {
            this.path = path
            this.dirChooserVisible = false
        },
        openFileChooser() {
            document.getElementById("selectFile").click()
        },
        onFileChange(e) {
            let files = e.target.files || e.dataTransfer.files // files[0]
            let fr = new FileReader()
            fr.readAsText(files[0])
            fr.onload = (res) => {
                this.code = res.target.result
                this.codeEditorComponentKey += 1
            }
        }
    }
}
</script>

<style scoped>
#new-spec {
    display: flex;
    flex-flow: column;
    flex: 1;
    margin: 0.5em;
    padding: 0.5em;
    overflow: auto;
}

.property {
    display: flex;
    margin-bottom: 1em;
}
</style>