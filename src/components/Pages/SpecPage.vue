<template>
    <div id="spec-page" :class="{'spec-page-mobile': isMobile}">
        <div id="spec-info" :class="{'spec-info-desktop': isDesktop}">
            <div style="display: flex">
                <div>
                    <Button icon="pi pi-chevron-circle-left" title="Back" @click="$router.push({path: '/'})"/>
                </div>
                <div style="display: flex; flex-flow: column; justify-content: center; padding-left: 0.5em; font-size: large; font-weight: bold;">
                    <div>
                        {{ name }}
                    </div>
                    <div style="color: grey">
                        {{ path }}
                    </div>
                </div>
            </div>
            <Card class="card">
                <template #title>Tags</template>
                <template #content>
                    <div v-for="group in tagGroups" :key="group.id" style="margin-bottom: 0.5em">
                        <span style="margin-right: 0.2em; text-transform: capitalize">{{ group.key }}:</span>
                        <Tag v-for="tag in group.tags" :key="tag.id" class="tag" :value="tag.value" />
                    </div>
                </template>
            </Card>
            <Card class="card">
                <template #title>Description</template>
                <template #content>
                    <div style="word-wrap: break-word;">
                        {{description}}
                    </div>
                </template>
            </Card>
            <Card class="card">
                <template #title>Visibility</template>
                <template #content>
                    <div style="display: flex; flex-flow: column">
                        <div style="display: flex; align-items: center; margin-bottom: 0.5em">
                            <Checkbox v-model="show_code" :binary="true" />
                            <div style="margin-left: 0.5em; cursor: pointer" @click="show_code = !show_code">
                                Code section
                            </div>
                        </div>
                        <div style="display: flex; align-items: center">
                            <Checkbox v-model="show_graph" :binary="true" />
                            <div style="margin-left: 0.5em; cursor: pointer" @click="show_graph = !show_graph">
                                Graph section
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <LibSLCodeEditor v-show="show_code" :content="sourceCode" style="min-height: 20em; margin: 0.2em 0.5em" />
        <Graph v-show="show_graph" :content="graphs" :reload="graphReloadKey" style="min-height: 20em; margin: 0.2em 0.5em" />
    </div>
</template>

<script>
import Card from 'primevue/card'
import LibSLCodeEditor from '@/components/CodeEditor/LibSLCodeEditor.vue'
import Graph from '@/components/Graph.vue'
import { mapGetters } from 'vuex'
export default {
    name: "v-spec-page",
    components: {
        Card,
        LibSLCodeEditor,
        Graph
    },
    mounted() {
        this.fetchSpecData()
    },
    data() {
        return {
            show_code: true,
            show_graph: true,

            name: "",
            path: "",
            description: "",
            tagGroups: [],

            sourceCode: "",
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

                r = await this.makeRequest("/specification/" + this.$route.params.id + "/tag", "GET")
                if (r.status == 200) {
                    this.tagGroups = (await r.json()).tagGroups
                }

                r = await this.makeRequest("/specification/" + this.$route.params.id + "/content", "GET")
                if (r.status == 200) {
                    this.sourceCode = await r.text()
                }

                r = await this.makeRequest("/specification/" + this.$route.params.id + "/automaton/graph", "GET")
                data = await r.json()
                this.graphs = []
                data.graphs.forEach((item) => {
                    this.graphs.push({"name": item.name, "model": {"nodes": item.graph_model.nodes, "edges": item.graph_model.edges}})
                })
            }
        }
    },
    computed: {
        ...mapGetters([
            "isMobile",
            "isDesktop"
        ])
    },
    watch: {
        async show_code(code_visible) {
            if (code_visible) {
                if (this.show_graph) {
                    await new Promise(resolve => setTimeout(resolve, 5))
                    this.graphReloadKey++
                }
            } else {
                if (!this.show_graph) this.show_graph = true
            }
        },
        show_graph(graph_visible) {
            if (!graph_visible && !this.show_code) this.show_code = true
        }
    }
}
</script>

<style scoped>
#spec-page {
    display: flex;
    flex: 1;
    padding: 1em 0.5em;
    overflow: auto;
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
}

.card {
    margin: 0.3em 0em;
}

.tag {
    margin-right: 0.5em;
}
</style>