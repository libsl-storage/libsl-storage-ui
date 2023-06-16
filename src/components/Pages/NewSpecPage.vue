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
            <LibSLCodeEditor :content="code" :readonly="false" />
        </div>
        <div style="display: flex; justify-content: right;">
            <Button label="Cancel" icon="pi pi-times" severity="secondary" style="margin-right: 1em"
                @click="$emit('cancel')" />
            <Button label="Save" icon="pi pi-save" @click="save" />
        </div>

        <PopUp v-model:visible="dirChooserVisible" header="Choose folder" :modal="true" :draggable="false">
            <DirChooser @select="setDir"/>
        </PopUp>
    </div>
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
    emits: [
        "cancel",
        "created"
    ],
    data() {
        return {
            libName: "",
            path: "",
            dirId: null,
            tags: "",
            description: "",
            dirChooserVisible: false,
            sourceFile: null,
            code: ""
        } 
    },
    methods: {
        setDir(data) {
            this.path = data.path
            this.dirId = data.dirId
            this.dirChooserVisible = false
        },
        openFileChooser() {
            document.getElementById("selectFile").click()
        },
        onFileChange(e) {
            let files = e.target.files || e.dataTransfer.files
            this.sourceFile = files[0]
            let fr = new FileReader()
            fr.readAsText(this.sourceFile)
            fr.onload = (res) => {
                this.code = res.target.result
            }
        },
        async save() {
            let r = await this.makeRequest("/specification", "POST", {
                "name": this.libName,
                "description": this.description,
                "directoryId": this.dirId
            })
            if (r.status == 201) {
                let data = await r.json()
                
                let formData = new FormData()
                formData.append("lslFile", this.sourceFile)

                let upload_r = await fetch(process.env.VUE_APP_ROOT_API + "/specification/" + data.id + "/upload", {
                    method: "POST",
                    credentials: "include",
                    body: formData
                })
                if (upload_r.status == 200) {
                    this.$toast.add({severity: "success", summary: "Specification created", life: 5000})
                    this.$emit("created")
                }
            } else if (r.status == 400) {
                this.$toast.add({severity: "error", summary: "Specification by specified path already exists", life: 5000})
            } else if (r.status == 403) {
                this.$toast.add({severity: "error", summary: "Only directory owner can create subdirectories", life: 5000})
            } else if (r.status == 404) {
                this.$toast.add({severity: "error", summary: "Specified parent directory not exists", life: 5000})
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