<template>
  <svg :width="width" :height="height">
    <g style="transform: translate(0, 10px)">
      <circle v-for="(node, index) in nodes" :key="index" :r="node.radius" :cx="node.x" :cy="node.y" :fill="node.color"></circle>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3'
// import d3Force from 'd3-force'
// import d3Quadtree from 'd3-quadtree'

export default {
  name: 'vote-chart',
  data() {
    return {
      width: 900,
      height: 600,
      nodes: null,
      root: null,
      force: null,
      data: [71, 75, 25, 39, 92, 84],
      line: '',
      simulation: null,
      radius: 25,
      buffer: 8
      // color:
    }
  },
  methods: {
    // TODO You will need to call simulation.nodes when adding or removing nodes from simulation
    /**
     * If the specified array of nodes is modified, such as when nodes are added to or removed from
     * the simulation, this method must be called again with the new (or changed) array to notify the
     * simulation and bound forces of the change; the simulation does not make a defensive copy of
     * the specified array.
     */
    createNodes() {
      this.nodes = d3.range(50).map( (i) => {
        return {
          radius: this.radius,
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          color: d3.gray(i)
        };
      })
    },
    createForce() {
      // TODO Put this in this.forces array instead
      this.simulation = d3.forceSimulation(this.nodes)
        .force("collide", d3.forceCollide(this.radius + this.buffer))
        .force("posX", d3.forceX(this.width/2).strength(() => {return 0.04}))
        .force("posY", d3.forceY(this.height/2).strength(() => {return 0.04}))
        // .force("posY", d3.forceRadial(200, this.width/2, this.height/2).strength(() => {return 0.1}))
      this.simulation.on("tick", (tickEvt) => {
        this.$forceUpdate();
      })
      // this.force.initialize(this.nodes)
    },
    calculatePath() {
      const scale = this.getScales();
      const path = d3.line()
        .x((d, i) => scale.x(i))
        .y(d => scale.y(d));
      this.line = path(this.data);
    },
    getScales() {
      const x = d3.scaleTime().range([0, 430]);
      const y = d3.scaleLinear().range([210, 0]);
      d3.axisLeft().scale(x);
      d3.axisBottom().scale(y);
      x.domain(d3.extent(this.data, (d, i) => i));
      y.domain([0, d3.max(this.data, d => d)]);
      return { x, y };
    },
  },
  mounted() {
    // this.calculatePath();
    this.createNodes()
    this.createForce()
  },
  watch: {
    data() {
      // this.calculatePath();
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  margin: 25px;
  path {
    fill: none;
    stroke: #76BF8A;
    stroke-width: 3px
  }
}

</style>
