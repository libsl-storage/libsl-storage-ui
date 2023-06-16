<template>
    <div id="graph" />
</template>

<script>
import cytoscape from 'cytoscape'
export default {
    name: "v-graph",
    props: {
      model: Object
    },
    data() {
        return {
            
        }
    },
    methods: {
      drawGraph() {
        cytoscape({
          container: document.getElementById("graph"),
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
            nodes: this.model.nodes,
            edges: this.model.edges,
          }
        })
      }
    },
    watch: {
      model() {
        this.drawGraph()
      }
    }
}
</script>

<style scoped>
#graph {
  display: flex;
  flex: 1;
  min-height: 20em;
  background-color: white;
  border: solid 1px black;
}
</style>