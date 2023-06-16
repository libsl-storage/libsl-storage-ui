<template>
    <div id="lib-page" :class="{'lib-page-mobile': isMobile}">
        <div id="lib-info" style="flex-flow: column">
            <div style="display: flex">
                <Button icon="pi pi-chevron-circle-left" title="Back" @click="$router.push({path: '/'})"/>
                <div style="display: flex; align-items: center; padding-left: 0.5em; font-size: large; font-weight: bold;">
                    {{libName}}
                </div>
            </div>
            <Card class="card">
                <template #title>Visibility</template>
                <template #content>
                    <div style="display: flex; flex-flow: column">
                        <div style="display: flex; align-items: center; margin-bottom: 0.5em">
                            <Checkbox v-model="show_code" :binary="true" />
                            <div style="margin-left: 0.5em">
                                Code section
                            </div>
                        </div>
                        <div style="display: flex; align-items: center">
                            <Checkbox v-model="show_graph" :binary="true" />
                            <div style="margin-left: 0.5em">
                                Graph section
                                <Dropdown v-model="selected_graph" :options="graphs" optionLabel="name" />
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
            <Card class="card">
                <template #title>Path</template>
                <template #content>
                    {{path}}
                </template>
            </Card>
            <Card class="card">
                <template #title>Tags</template>
                <template #content>
                    <div style="margin-top: 1em">
                        <Tag class="tag" value="tag1" />
                        <Tag class="tag" value="tag1" />
                    </div>
                </template>
            </Card>
            <Card class="card">
                <template #title>Description</template>
                <template #content>
                    {{description}}
                </template>
            </Card>
        </div>
        <div v-show="show_code" style="display: flex; flex: 1; min-height: 20em;">
            <LibSLCodeEditor :content="sourceCode" style="margin: 0.5em" />
        </div>
        <Graph v-show="show_graph" :model="selected_graph.model" style="margin: 0.5em"/>
    </div>
</template>

<script>
import Card from 'primevue/card'
import LibSLCodeEditor from '@/components/CodeEditor/LibSLCodeEditor.vue'
import Graph from '@/components/Graph.vue'
import { mapGetters } from 'vuex'
export default {
    name: "v-lib-page",
    components: {
        Card,
        LibSLCodeEditor,
        Graph
    },
    mounted() {
        this.fetchLibData()
    },
    data() {
        return {
            show_code: true,
            show_graph: true,

            libName: "",
            path: "",
            description: "",

            sourceCode: "",
            graphs: [],
            selected_graph: {}
        }
    },
    methods: {
        async fetchLibData() {
            let r = await this.makeRequest("/specification/" + this.$route.params.id, "GET")
            if (r.status == 404)  {
                this.$router.push({"path": "/"})
            } else if (r.status == 200)  {
                let data = await r.json()
                this.libName = data.name
                this.path = data.path
                this.description = data.description

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
                this.selected_graph = this.graphs[0]
            }
        }
    },
    computed: {
        ...mapGetters([
            "isMobile"
        ])
    },
    watch: {
        show_code() {
            if (!this.show_code && !this.show_graph)
                this.show_graph = true
        },
        show_graph() {
            if (!this.show_graph && !this.show_code)
                this.show_code = true
        }
    }
}
</script>

<style scoped>
#lib-page {
    display: flex;
    flex: 1;
    padding: 1em 0.5em;
    overflow: auto;
}

.lib-page-mobile {
    flex-flow: column;
}

#lib-info {
    min-width: 15em;
    margin: 0.5em;
}

.card {
    margin: 1em 0em;
}

.tag {
    margin-right: 0.5em;
}
</style>