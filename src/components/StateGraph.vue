<template>
    <div id="graph" />
</template>

<script>
import go from 'gojs'
var $ = go.GraphObject.make
export default {
    name: "v-state-graph",
    props: {
      model: Object
    },
    mounted() {
      var graph = $(go.Diagram, this.$el)
      graph.model = go.Model.fromJson(this.model)
      graph.isReadOnly = true
      graph.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, {cursor: "pointer"},
            new go.Binding("fill", "color")),
          $(go.TextBlock, { margin: 10 },
            new go.Binding("text").makeTwoWay())
        )
    },
    data() {
        return {
            
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