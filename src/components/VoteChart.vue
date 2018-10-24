<template>
  <svg :width="width" :height="height" @click="continueSimulation()">
    <g>
      <circle v-for="(node, index) in nodes" :key="index" :r="radius" :cx="node.x" :cy="node.y" :fill="node.color" stroke="black" stroke-width="2px"></circle>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3'
// import d3Force from 'd3-force'
// import d3Quadtree from 'd3-quadtree'

export default {
  name: 'vote-chart',
  props: {
    gameState: {
      required: true
    }
  },
  data() {
    return {
      width: 900,
      height: 500,
      nodes: null,
      root: null,
      line: '',
      simulation: null,
      zones: [{x:0, y:0}],
      forces: [{label: 'posX0', force: d3.forceX(0)}],
      maxZonesHad: 0
    }
  },
  computed: {
    radius() {
      return 4;
    },
    buffer() {
      return 2;
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
      this.nodes = this.gameState.players.map( (player, i) => {
        return {
          emoji: player.emoji,
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          color: d3.gray(i*2),
          choiceIndex: player.choiceIndex,
          playerId: player.playerId                                           
        }
      })
    },
    syncNodes() {
      this.nodes = this.nodes.filter( (node, i) => { // remove players that have left
        this.gameState.players.some( player => { // will be true if any gamestate players match playerId
          return node.playerId === player.playerId
        })
      })

      // This should add any new gamestate players not in nodes
      this.gameState.players.forEach( (player, i) => {
        const alreadyInNodes = this.nodes.some( node => { // will be true if any nodes match playerId
          console.log("npid", node.playerId, "pid", player.playerId)
          return node.playerId === player.playerId
        })

        console.log(`${player.playerId} in nodes? ${alreadyInNodes}`)

        if (!alreadyInNodes) {
          this.addNode(player)
        }
      })
    },
    addNode(player) {
      this.nodes.push({
        emoji: player.emoji,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        color: d3.gray(50),
        choiceIndex: player.choiceIndex,
        playerId: player.playerId
      });
    },
    continueSimulation() {
      this.simulation.nodes(this.nodes);
      this.simulation.alpha(1);
      this.simulation.restart();
    },
    createSimulation() {
      this.simulation = d3.forceSimulation(this.nodes);
      this.updateSimulationForces();

      this.simulation.on("tick", (tickEvt) => {
        this.$forceUpdate();
      })
      // this.force.initialize(this.nodes)
    },
    updateSimulationForces() {
      this.forces.forEach( f => {
        this.simulation.force(f.label, f.force)
      })
    },
    calculateZones() {
      // TODO better algorithm with vertical separation
      let xScale = d3.scaleLinear()
        .domain([0, this.gameState.choices.length])
        .range([this.width * 0.15, this.width * 1.6])
      
      let yScale = index => { return this.height * 0.5}

      this.zones = this.gameState.choices.map( (choice, index) => {
        return {
          x: xScale(index),
          y: yScale(index)
        }
      })

      if (this.zones.length > this.maxZonesHad) {
        this.maxZonesHad = this.zones.length
      }
    },
    calculateZoneForces() {
      let choiceForces = []
      // TODO: use force.initialize instead of force.strength to select nodes
      this.gameState.choices.forEach( (choice, index) => {
        choiceForces.push({
          label: `posX${index}`,
          force: d3.forceX(this.zones[index].x).strength( (node, i) => {
            return node.choiceIndex === index ? 0.04 : 0;
          })
        }) 
        choiceForces.push({
          label: `posY${index}`,
          force: d3.forceY(this.zones[index].y).strength( (node, i) => {
            return node.choiceIndex === index ? 0.04 : 0;
          })
        }) 
      })
      
      choiceForces.push({
        label: 'collide',
        force: d3.forceCollide(this.radius + this.buffer)
      })

      let neutralForceStrength = (node, i) => {
        return node.choiceIndex === -1 ? 0.06 : 0;
      }
      choiceForces.push({
        label: 'neutralX',
        force: d3.forceX(this.width/2).strength(neutralForceStrength)
      })
      choiceForces.push({
        label: 'neutralY',
        force: d3.forceY(this.height * 0.85).strength(neutralForceStrength)
      })

      this.forces = choiceForces;
    },
    removeZoneForces() {
      d3.range(this.maxZonesHad).forEach( zoneIndex => {
        this.simulation.force(`posX${zoneIndex}`, null)
        this.simulation.force(`posY${zoneIndex}`, null)
      })
    }
  },
  mounted() {
    console.log(this.gameState)
    this.createNodes();
    this.createSimulation()
    this.calculateZones();
    this.calculateZoneForces();
    this.updateSimulationForces();
  },
  watch: {
    gameState() {
      this.syncNodes();
      this.removeZoneForces();
      this.calculateZones();
      this.calculateZoneForces();
      this.updateSimulationForces();
      this.continueSimulation();
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
