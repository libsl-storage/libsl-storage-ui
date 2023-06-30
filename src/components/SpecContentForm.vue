<template>
    <div id="spec-content-form">
        <div class="property">
            <InputText v-model="name" placeholder="Name" :disabled="editable" style="width: 100%" autofocus />
        </div>
        <div class="property">
            <span class="p-input-icon-right" style="flex: 1" @click="dirChooserVisible = true">
                <i class="pi pi-folder-open" style="cursor: pointer" />
                <InputText v-model="path" :disabled="editable" placeholder="Path" :readonly="true" style="width: 100%"/>
            </span>
        </div>
        <div class="property">
            <InputText v-model="description" placeholder="Description" style="width: 100%" />
        </div>
        <div class="property">
            <div style="display: flex; align-items: center; flex: 1; padding: 0.5em; border: 1px solid #ced4da; border-radius: 3px;">
                <div v-show="tags.size == 0" style="flex: 1; color: #B6B6B4" @click="newTag = ''; createTagPopUpVisible = true">
                    Tags
                </div>
                <div v-show="tags.size != 0" style="flex: 1">
                    <Tag v-for="tag in tags" :key="tag.id" style="margin-right: 0.5em">
                        {{ tag }}
                        <i class="pi pi-times text-xs" style="margin-left: 1em; font-size: 0.8em; cursor: pointer"
                            @click="deleteTag(tag)" />
                    </Tag>
                </div>
                <i class="pi pi-plus" style="cursor: pointer" @click="newTag = ''; createTagPopUpVisible = true" />
            </div>
        </div>
        <div class="property" style="display: flex; flex-flow: column; flex: 1">
            <div style="display: flex; justify-content: right; margin-bottom: 0.5em">
                <input id="selectFile" type="file" @change="onFileChange" style="display: none" />
                <Button label="Select file" icon="pi pi-file" @click="openFileChooser" />
            </div>
            <LibSLCodeEditor v-model:content="code" :readonly="false" />
        </div>
        <div style="display: flex; justify-content: right">
            <Button label="Cancel" icon="pi pi-times" severity="secondary" style="margin-right: 0.5em" @click="cancel" />
            <Button label="Save" icon="pi pi-save" :disabled="name.length == 0 || path.length == 0 || code.length == 0"
                @click="save"/>
        </div>

        <PopUp v-model:visible="dirChooserVisible" header="Choose folder" :modal="true" :draggable="false">
            <DirChooser @select="setDir"/>
        </PopUp>

        <PopUp v-model:visible="createTagPopUpVisible" header="New tag" :modal="true" :draggable="false">
            <div style="display: flex">
                <InputText v-model="newTag" placeholder="Tag" autofocus @keydown.enter="addTag(newTag)"/>
            </div>
            <template #footer>
              <Button label="Apply" :disabled="newTag.length == 0" @click="addTag(newTag)" />
            </template>
        </PopUp>

        <PopUp v-model:visible="cancelPopUpVisible" header="Cancel" :modal="true" :draggable="false">
            <div>
                Your changes will be lost. Are you sure you want to continue?
            </div>
            <template #footer>
                <Button label="No" @click="cancelPopUpVisible = false" />
                <Button label="Yes" @click="$emit('response', 'cancelled')"/>
            </template>
        </PopUp>
    </div>
</template>

<script>
import DirChooser from "@/components/DirChooser/DirChooser.vue"
import LibSLCodeEditor from "@/components/CodeEditor/LibSLCodeEditor.vue"
export default {
    name: "v-spec-content-form",
    components: {
        DirChooser,
        LibSLCodeEditor
    },
    props: {
        editable: {
            type: Boolean,
            default: false
        },
        specId: String,
        specName: String,
        specPath: String,
        specDescription: String,
        specTags: Object, // {"tag1": <id1>, "tag2": <id2>,...}
        specCode: String
    },
    emits: [
        "response"
    ],
    mounted() {
        if (this.editable) {
            this.name = this.specName
            this.path = this.specPath
            this.description = this.specDescription

            this.tags = new Set()
            Object.keys(this.specTags).forEach((key) => this.tags.add(key))

            this.code = this.specCode
        }
    },
    data() {
        return {
            name: "",
            
            path: "",
            dirId: null,
            dirChooserVisible: false,
            
            description: "",
            
            tags: new Set(),
            createTagPopUpVisible: false,
            newTag: "",

            code: "",

            cancelPopUpVisible: false
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
            fr.onload = (res) => { this.code = res.target.result.replaceAll("\r", "") }
        },
        addTag(tag) {
            this.tags.add(tag)
            this.createTagPopUpVisible = false
        },
        deleteTag(tag) {
            this.tags.delete(tag)
        },
        cancel() {
            if (this.editable) { // editing spec
                const eqSet = (xs, ys) => xs.size === ys.size && [...xs].every((x) => ys.has(x))
                let previous_tag_set = new Set()
                Object.keys(this.specTags).forEach((key) => previous_tag_set.add(key))
                if (this.specDescription != this.description || !eqSet(previous_tag_set, this.tags) || this.specCode != this.code) {
                    this.cancelPopUpVisible = true
                } else {
                    this.$emit("response", "cancelled")
                }
            } else { // new spec
                if (this.name || this.path || this.description || this.tags.size || this.code) {
                    this.cancelPopUpVisible = true
                } else {
                    this.$emit("response")
                }
            }
        },
        async save() {
            if (this.editable) {
                await this.updateSpec()
                this.$emit("response", "updated")
            } else {
                await this.createSpec()
            }
        },
        async createSpec() {
            let r = await this.makeRequest("/specification", "POST", {
                "name": this.name,
                "description": this.description,
                "directoryId": this.dirId
            })
            if (r.status == 201) {
                let data = await r.json()

                for (let tag of this.tags) {
                    await this.makeRequest("/specification/" + data.id + "/tag", "POST", {
                        "key": "other",
                        "value": tag
                    })
                }

                const source_file = new Blob([this.code], { type: "text/plain" })
                let formData = new FormData()
                formData.append("lslFile", source_file)
                let upload_r = await this.makeRequest("/specification/" + data.id + "/upload", "POST", formData)
                if (upload_r.status == 200) {
                    this.$toast.add({severity: "success", summary: "Specification created", life: 5000})
                    this.$emit("response")
                }
            } else if (r.status == 400) {
                this.$toast.add({severity: "error", summary: "Specification by specified path already exists", life: 5000})
            } else if (r.status == 403) {
                this.$toast.add({severity: "error", summary: "Only directory owner can create subdirectories", life: 5000})
            } else if (r.status == 404) {
                this.$toast.add({severity: "error", summary: "Specified parent directory not exists", life: 5000})
            }
        },
        async updateSpec() {
            if (this.specDescription != this.description) {
                await this.makeRequest("/specification/" + this.specId, "POST", {
                    "description": this.description
                })
            }

            if (this.specCode != this.code) {
                const source_file = new Blob([this.code], { type: "text/plain" })
                let formData = new FormData()
                formData.append("lslFile", source_file)
                await this.makeRequest("/specification/" + this.specId + "/upload", "POST", formData)
            }

            for (let tag of this.tags) {
                if (!(tag in this.specTags)) {
                    await this.makeRequest("/specification/" + this.specId + "/tag", "POST", {
                        "value": tag
                    })
                }
            }

            for (let item of Object.keys(this.specTags)) {
                if (!this.tags.has(item)) {
                    await this.makeRequest("/specification/" + this.specId + "/tag/" + this.specTags[item], "DELETE")
                }
            }
        }
    }
}
</script>

<style scoped>
#spec-content-form {
    display: flex;
    flex-flow: column;
    flex: 1;
    margin: 0.5em;
    padding: 0.5em;
    overflow: auto;
}

.property {
    display: flex;
    margin-bottom: 0.5em;
}
</style>