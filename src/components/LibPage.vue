<template>
    <div id="lib-page" :class="{'lib-page-mobile': isMobile}">
        <div id="lib-info" style="flex-flow: column">
            <div style="display: flex; justify-content: space-between">
                <Button icon="pi pi-chevron-circle-left" title="Back" @click="$router.push({path: '/'})"/>
                <Button icon="pi pi-download" title="Download" />
            </div>
            <div style="display: flex; align-items: center; margin-top: 1em; font-size: large; font-weight: bold;">
                LibName
            </div>
            <div style="margin-top: 1em">
                <Tag class="tag" value="tag1" />
                <Tag class="tag" value="tag1" />
            </div>
            <div style="margin-top: 1em">
                Description 
            </div>
        </div>
        <div style="display: flex; flex: 1; min-height: 20em;">
            <LibSLCodeEditor :content="code" style="margin: 0.5em" />
        </div>
        <Graph :model="model" style="margin: 0.5em"/>
    </div>
</template>

<script>
import LibSLCodeEditor from '@/components/CodeEditor/LibSLCodeEditor.vue'
import Graph from '@/components/StateGraph.vue'
import { mapGetters } from 'vuex';
export default {
    name: "v-lib-page",
    components: {
        LibSLCodeEditor,
        Graph
    },
    data() {
        return {
            code: "LibSL\n\t\tcode\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1",
            model: {
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
    min-width: 12em;
    margin: 0.5em;
    padding: 1em 0.5em;
    border-radius: 0.25em;
    background-color: white;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.1);
}

.tag {
    margin-right: 0.5em;
}
</style>