<template>
    <div id="new-spec">
        <div class="property">
            <InputText v-model="libName" placeholder="Name" style="width: 100%" autofocus />
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
            <div style="display: flex; align-items: center; flex: 1; padding: 0.5em; margin-right: 1em; border: 1px solid #ced4da; border-radius: 3px;">
                <div v-show="tags.length == 0" style="color: #B6B6B4">
                    Tags
                </div>
                <div v-show="tags.length != 0">
                    <Tag v-for="item in tags" :key="item.id" class="tag">
                        {{ item.key + ':' + item.value }}
                        <i class="pi pi-times text-xs" style="margin-left: 1em; font-size: 0.8em; cursor: pointer"
                            @click="deleteTag(item.key, item.value)" />
                    </Tag>
                </div>
            </div>
            <div style="display: flex; align-items: center;">
                <Button icon="pi pi-plus" @click="newTagKey = ''; newTagValue = ''; createTagPopUpVisible = true" />
            </div>
        </div>
        <div class="property" style="display: flex; flex-flow: column; flex: 1">
            <div style="display: flex; justify-content: right; margin-bottom: 0.5em">
                <input id="selectFile" type="file" @change="onFileChange" style="display: none" />
                <Button label="Select file" icon="pi pi-file" @click="openFileChooser" />
            </div>
            <LibSLCodeEditor v-model:content="code" :readonly="false" />
        </div>
        <div style="display: flex; justify-content: right;">
            <Button label="Cancel" icon="pi pi-times" severity="secondary" style="margin-right: 1em"
                @click="$emit('cancel')" />
            <Button label="Save" icon="pi pi-save" @click="save"
                :disabled="libName.length == 0 || path.length == 0 || code.length == 0" />
        </div>

        <PopUp v-model:visible="createTagPopUpVisible" header="New tag" :modal="true" :draggable="false">
            <div style="display: flex; flex-flow: column;">
                <div style="margin-bottom: 1em">
                    <InputText v-model="newTagKey" placeholder="Key" autofocus />
                </div>
                <div>
                    <InputText v-model="newTagValue" placeholder="Value" />
                </div>
            </div>
            <template #footer>
              <Button label="Apply" :disabled="newTagKey.length == 0 || newTagValue.length == 0" @click="addTag" />
            </template>
        </PopUp>

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
            dirChooserVisible: false,
            
            description: "",
            
            createTagPopUpVisible: false,
            newTagKey: "",
            newTagValue: "",
            tags: [],

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
            let fr = new FileReader()
            fr.readAsText(files[0])
            fr.onload = (res) => { this.code = res.target.result }
        },
        addTag() {
            this.tags.push({"key": this.newTagKey, "value": this.newTagValue})
            this.createTagPopUpVisible = false
        },
        deleteTag(tagKey, tagValue) {
            let i = 0
            while (i < this.tags.length) {
                if (this.tags[i].key == tagKey && this.tags[i].value == tagValue) {
                    this.tags.splice(i, 1)
                    break
                }
                i++
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

                for (let i = 0; i < this.tags.length; i++) {
                    this.makeRequest("/specification/" + data.id + "/tag", "POST", {
                        "key": this.tags[i].key,
                        "value": this.tags[i].value
                    })
                }

                const source_file = new Blob([this.code], { type: "text/plain" })
                let formData = new FormData()
                formData.append("lslFile", source_file)
                
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