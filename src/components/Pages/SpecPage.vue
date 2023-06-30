<template>
    <div id="spec-page" :class="{'spec-page-mobile': isMobile}">
        <div id="spec-info" :class="{'spec-info-desktop': isDesktop}">
            <div style="display: flex">
                <div>
                    <Button icon="pi pi-chevron-left" title="Back" @click="back"/>
                </div>
                <div id="spec-name" :title="name">
                    {{ name }}
                </div>
                <div>
                    <Button v-show="canEdit" icon="pi pi-pencil" title="Edit" text @click="editSpecPopUpVisible = true" />
                    <Button v-show="canDelete" icon="pi pi-trash"  title="Delete" text severity="danger"
                        @click="deletePopUpVisible = true" />
                </div>
            </div>
            <div style="overflow-y: auto">
                <Card class="meta-info-block">
                    <template #content>
                        <div class="meta-info-item">
                            <span class="meta-info-item-name">Path:</span>
                            <div style="word-wrap: anywhere">{{path}}</div>
                        </div>
                        <div class="meta-info-item">
                            <span class="meta-info-item-name">LibSL:</span>
                            <div style="word-wrap: anywhere">{{libslVersion}}</div>
                        </div>
                        <div class="meta-info-item">
                            <span class="meta-info-item-name">Name:</span>
                            <div style="word-wrap: anywhere">{{libraryName}}</div>
                        </div>
                        <div class="meta-info-item">
                            <span class="meta-info-item-name">Version:</span>
                            <div style="word-wrap: anywhere">{{libraryVersion}}</div>
                        </div>
                        <div class="meta-info-item">
                            <span class="meta-info-item-name">Language:</span>
                            <div style="word-wrap: anywhere">{{libraryLanguage}}</div>
                        </div>
                        <div class="meta-info-item">
                            <span class="meta-info-item-name">URL:</span>
                            <div style="word-wrap: anywhere">{{libraryURL}}</div>
                        </div>
                        <div v-show="tags.length" class="meta-info-item">
                            <span class="meta-info-item-name">Tags:</span>
                            <div style="word-wrap: anywhere">
                                <Tag v-for="tag in tags" :key="tag.id" class="tag" :value="tag.value" />
                            </div>
                        </div>
                    </template>
                </Card>
                <Card class="meta-info-block">
                    <template #title>Description</template>
                    <template #content>
                        <div style="word-wrap: break-word">
                            {{description}}
                        </div>
                    </template>
                </Card>
            </div>
        </div>
        <div style="display: flex; flex-flow: column; flex: 1">
            <div style="display: flex; justify-content: center; margin-bottom: 0.5em">
                <SelectButton v-model="visibility" :options="visibility_options" :disabled="any_errors">
                    <template #option="slotProps">
                        <div v-show="slotProps.option == 'Code'" class="pi pi-code" />
                        <div v-show="slotProps.option == 'Graph'" class="pi pi-sitemap" />
                        <div style="margin-left: 0.2em">
                            {{ slotProps.option }}
                        </div>
                    </template>
                </SelectButton>
            </div>
            <div id="container" :class="{'container-mobile': isMobile}">
                <div v-show="left_block_visible" style="display: flex; flex: 1">
                    <LibSLCodeEditor :content="sourceCode" :errors="getErrors" :class="isMobile ? 'code-section-mobile' : 'code-section-desktop'" />
                </div>
                <div v-show="right_block_visible" style="display: flex; flex: 1; overflow: auto">
                    <div v-if="any_errors" style="flex: 1; padding: 0em 0.5em">
                        <Card v-for="(item, index) in errors" :key="item.id" class="error">
                            <template #title>Error {{ index + 1}}</template>
                            <template #content>
                                {{item.message}}
                            </template>
                        </Card>
                    </div>
                    <Graph v-else :content="graphs" :reload="graphReloadKey" :class="{'graph-section-mobile': isMobile}" />
                </div>
            </div>
        </div>
    </div>

    <PopUp :visible="editSpecPopUpVisible" header="Edit specification" :modal="true" :closable="false" :draggable="false"
        style="width: 90%; height: 90%">
        <SpecContentForm :editable="true" :specId="$route.params.id" :specName="name" :specPath="path"
            :specDescription="description" :specTags="getTags" :specCode="sourceCode"
            @response="editHandler" />
    </PopUp>

    <PopUp v-model:visible="deletePopUpVisible" header="Delete specification" :modal="true" :draggable="false">
        <div>
            Are you sure you want to delete this specification?
        </div>
        <template #footer>
            <Button label="Cancel" severity="secondary" @click="deletePopUpVisible = false" />
            <Button label="Delete" severity="danger" @click="deleteSpec"/>
        </template>
    </PopUp>
</template>

<script>
import Card from "primevue/card"
import LibSLCodeEditor from "@/components/CodeEditor/LibSLCodeEditor.vue"
import Graph from "@/components/Graph.vue"
import SpecContentForm from "@/components/SpecContentForm.vue"
import { mapGetters, mapActions } from "vuex"
export default {
    name: "v-spec-page",
    components: {
        Card,
        LibSLCodeEditor,
        Graph,
        SpecContentForm
    },
    mounted() {
        this.fetchSpecData()
    },
    data() {
        return {
            name: "",
            canEdit: false,
            editSpecPopUpVisible: false,
            canDelete: false,
            deletePopUpVisible: false,
            path: "",
            description: "",
            libslVersion: "",
            libraryName: "",
            libraryVersion: "",
            libraryLanguage: "",
            libraryURL: "",
            tags: [],

            visibility_options: ["Code", "All", "Graph"],
            visibility: "All",
            left_block_visible: true,
            right_block_visible: true,

            sourceCode: "",

            any_errors: false,
            errors: [],

            graphs: [],
            graphReloadKey: 0
        }
    },
    methods: {
        async fetchSpecData() {
            let r = await this.makeRequest("/specification/" + this.$route.params.id, "GET")
            if (r.status == 404)  {
                this.$router.push({"path": "/"})
            } else if (r.status == 200)  {
                let data = await r.json()
                this.name = data.name
                this.path = data.path
                this.description = data.description
                this.libslVersion = data.libslVersion
                this.libraryName = data.libraryName
                this.libraryVersion = data.libraryVersion
                this.libraryLanguage = data.libraryLanguage
                this.libraryURL = data.libraryURL
                this.tags = data.tags

                r = await this.makeRequest("/specification/" + this.$route.params.id + "/permissions", "GET")
                if (r.status == 200) {
                    let permissions = (await r.json()).permissions
                    this.canEdit = permissions.includes("EDIT")
                    this.canDelete = permissions.includes("REMOVE")
                }

                r = await this.makeRequest("/specification/" + this.$route.params.id + "/content", "GET")
                if (r.status == 200) {
                    this.sourceCode = await r.text()
                }

                r = await this.makeRequest("/specification/" + this.$route.params.id + "/error", "GET")
                if (r.status == 200) {
                    this.errors = (await r.json()).errors
                    this.any_errors = this.errors.length != 0
                }

                if (!this.any_errors) { // there are no errors
                    r = await this.makeRequest("/specification/" + this.$route.params.id + "/automaton/graph", "GET")
                    data = await r.json()
                    this.graphs = []
                    data.graphs.forEach((item) => {
                        this.graphs.push({"name": item.name, "model": {"nodes": item.graph_model.nodes, "edges": item.graph_model.edges}})
                    })
                }
            }
        },
        back() {
            this.$router.push({path: '/'})
        },
        async editHandler(status) {
            this.editSpecPopUpVisible = false
            if (status == "updated") {
                await this.fetchSpecData()
                this.search()
            }
        },
        async deleteSpec() {
            let r = await this.makeRequest("/specification/" + this.$route.params.id, "DELETE")
            if (r.status == 200) {
                this.deletePopUpVisible = false
                this.search()
                this.back()
            }
        },
        async reloadGraph() {
            await new Promise(resolve => setTimeout(resolve, 5)) // wait a little while the template is being rendered
            this.graphReloadKey++
        },
        ...mapActions([
            "search"
        ])
    },
    computed: {
        getTags() {
            let result = {}
            this.tags.forEach((item) => { result[item.value] = item.id })
            return result
        },
        getErrors() {
            let result = {}
            this.errors.forEach((err) => {
                if (err.startPosition >= 0) {
                    if (err.startPosition == err.endPosition) {
                        result[err.startPosition - 2] = err.endPosition
                    } else if (err.startPosition < err.endPosition) {
                        result[err.startPosition] = err.endPosition
                    }
                }
            })
            return result
        },
        ...mapGetters([
            "isMobile",
            "isDesktop"
        ])
    },
    watch: {
        async visibility() {
            switch(this.visibility) {
                case "All":
                    this.left_block_visible = true
                    this.right_block_visible = true
                    this.reloadGraph()
                    break
                case "Code":
                    this.left_block_visible = true
                    this.right_block_visible = false
                    break
                case "Graph":
                    this.left_block_visible = false
                    this.right_block_visible = true
                    this.reloadGraph()
                    break
            }
        }
    }
}
</script>

<style scoped>
#spec-page {
    display: flex;
    flex: 1;
    padding: 1em 0.5em;
}

.spec-page-mobile {
    flex-flow: column;
}

#spec-info {
    display: flex;
    flex-flow: column;
}

.spec-info-desktop {
    width: 16em;
    margin-right: 0.5em;
}

#spec-name {
    display: flex;
    flex: 1;
    align-items: center;
    word-wrap: anywhere;
    padding: 0em 0.5em;
    font-weight: bold;
}

.meta-info-block {
    margin: 0.5em 0em;
}

.meta-info-item {
    display: flex;
    margin-bottom: 0.25em;
}

.meta-info-item-name {
    font-weight: bold;
    margin-right: 0.5em;
}

.tag {
    margin-right: 0.5em;
}

.code-section-desktop {
    margin-right: 0.5em;
}

.code-section-mobile, .graph-section-mobile {
    min-height: 25em;
    margin: 0.5em;
}

#container {
    display: flex;
    flex: 1;
    overflow: auto;
}

.container-mobile {
    flex-flow: column;
}

.error {
    margin-bottom: 1em;
    background-color: #E34234;
    color: white;
}
</style>