<template>
  <div id="graph">
    <div id="canvas" />
    <div style="position: absolute; margin: 0.3em">
      <Dropdown v-model="selected_graph" :options="content" optionLabel="name" />
      <Button icon="pi pi-refresh" text rounded style="margin-left: 0.2em" title="Reload" @click="drawGraph" />
    </div>
  </div>
</template>

<script>
import cytoscape from "cytoscape"
export default {
    name: "v-graph",
    props: {
      content: Array, // [{"name": "graph name", "model": {"nodes": {...}, "edges": {...}}},...]
      reload: Number
    },
    data() {
        return {
          selected_graph: null,
          cy: null
        }
    },
    methods: {
      drawGraph() {
        if (!this.selected_graph) return
        
        this.cy = cytoscape({
          container: document.getElementById("canvas"),
          autoungrabify: true,
          //autounselectify: true,
          style: cytoscape
            .stylesheet()
            .selector("node")
            .css({
              "shape": "rectangle",
              "border-width": 1,
              "border-color": "black",
              "background-color": "white",
              "content": "data(name)",
              "text-wrap": "wrap",
              "text-valign": "center",
              "text-halign": "center",
              "padding": 5
            })
            .selector("edge")
            .css({
              "width": 1,
              "line-color": "black",
              'curve-style': 'bezier',
              "target-arrow-shape": "triangle",
              "target-arrow-color": "black"
            }),
          elements: {
            nodes: this.selected_graph.model.nodes,
            edges: this.selected_graph.model.edges
          }
        })
      }
    },
    watch: {
      content() {
        this.selected_graph = this.content[0]
      },
      reload() {
        this.drawGraph()
      },
      selected_graph() {
        this.drawGraph()
      }
    }
}
</script>

<style scoped>
#graph {
  display: flex;
  flex: 1;
  position: relative;
  background-color: white;
  border: solid 1px grey;
}

#canvas {
  display: flex;
  flex: 1;
  margin: 1.5em 0em;
}
</style>