<template>
    <div id="lib-page" :class="{'lib-page-mobile': isMobile}">
        <div id="lib-info" style="flex-flow: column">
            <div style="display: flex">
                <Button icon="pi pi-chevron-circle-left" title="Back" @click="$router.push({path: '/'})"/>
                <div style="display: flex; align-items: center; padding-left: 0.5em; font-size: large; font-weight: bold;">
                    LibName
                </div>
            </div>
            <Card class="card">
                <template #title>Visibility</template>
                <template #content>
                    <div style="display: flex; flex-flow: column">
                        <div style="display: flex; align-items: center; margin-bottom: 0.5em">
                            <Checkbox v-model="show_code" :binary="true" />
                            <div style="cursor: pointer; margin-left: 0.5em" @click="show_code=!show_code">
                                Code
                            </div>
                        </div>
                        <div style="display: flex; align-items: center">
                            <Checkbox v-model="show_graph" :binary="true" />
                            <div style="cursor: pointer; margin-left: 0.5em" @click="show_graph=!show_graph">
                                Graph
                            </div>
                        </div>
                    </div>
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
                    description
                </template>
            </Card>
        </div>
        <div v-show="show_code" style="display: flex; flex: 1; min-height: 20em;">
            <LibSLCodeEditor :content="code" style="margin: 0.5em 1em" />
        </div>
        <Graph v-show="show_graph" :model="graph_model" style="margin: 0.5em 1em"/>
    </div>
</template>

<script>
import Card from 'primevue/card'
import LibSLCodeEditor from '@/components/CodeEditor/LibSLCodeEditor.vue'
import Graph from '@/components/StateGraph.vue'
import { mapGetters } from 'vuex';
export default {
    name: "v-lib-page",
    components: {
        Card,
        LibSLCodeEditor,
        Graph
    },
    data() {
        return {
            show_code: true,
            show_graph: true,
            code: "LibSL\n\t\tcode",
            graph_model: {
                "class": "GraphLinksModel",
                "nodeDataArray": [
                    {"key": 1, "text": "Alpha", "color": "lightblue"},
                    {"key": 2, "text": "Beta", "color": "orange"},
                    {"key": 3, "text": "Gamma", "color": "lightgreen"},
                    {"key": 4, "text": "Delta", "color": "yellow"}
                ],
                "linkDataArray": [
                    {"from": 1, "to": 2},
                    {"from": 1, "to": 3},
                    {"from": 3, "to": 4},
                    {"from": 2, "to": 4}
                ]
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