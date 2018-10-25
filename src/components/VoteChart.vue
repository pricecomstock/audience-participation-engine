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
      // choiceNodes: null,
      // choiceSim: null,
      zones: [{x:0, y:0}],
      forces: [{label: 'posX0', force: d3.forceX(0)}],
      maxZonesHad: 0
    }
  },
  computed: {
    radius() {
      return 10;
    },
    buffer() {
      return 4;
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
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          color: d3.gray(i*2),
          player: player                                    
        }
      })
    },
    syncNodes() {
      this.nodes = this.nodes.filter( (node, i) => { // remove players that have left
        return this.gameState.players.some( player => { // will be true if any gamestate players match playerId
          return node.player.playerId === player.playerId
        })
      })

      // This should add any new gamestate players not in nodes
      this.gameState.players.forEach( (player, i) => {
        const alreadyInNodes = this.nodes.some( node => { // will be true if any nodes match playerId
          return node.player.playerId === player.playerId
        })

        if (!alreadyInNodes) {
          this.addNode(player)
        }
      })

      this.nodes.forEach( (node, i) => {
        node.player = this.gameState.players.find( player => {
          return node.player.playerId === player.playerId;
        })
      })
    },
    addNode(player) {
      this.nodes.push({
        x: this.width/2,
        y: this.height* 0.6,
        color: d3.gray(50),
        player: player
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
    // createChoiceSim() {
    //   let distance = 100
    //   this.choiceNodes = this.gameState.choices.map(choice, index => {

    //   })

    //   this.choiceSim = d3.forceSimulation(this.choiceNodes)
    //     .force("distance", d3.forceCollide(distance))
    //     .force("centerX", d3.forceX(this.width/2))
    //     .force("centerY", d3.forceY(this.height/2))
    //     .force("center", d3.forceCenter(this.width/2, this.height/2))

    //   this.simulation.on("end", (e) => {
    //     this.calculateZoneForces()
    //   })
    //   // this.force.initialize(this.nodes)
    // },
    calculateZones() {
      // TODO better algorithm with vertical separation
      let xScale = d3.scaleLinear()
        .domain([0, this.gameState.choices.length - 1])
        .range([this.width * 0.15, this.width * 0.85])

      let yScale = index => { return this.height * 0.3}

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
            return node.player.choiceIndex === index ? 0.04 : 0;
          })
        }) 
        choiceForces.push({
          label: `posY${index}`,
          force: d3.forceY(this.zones[index].y).strength( (node, i) => {
            return node.player.choiceIndex === index ? 0.04 : 0;
          })
        }) 
      })
      
      choiceForces.push({
        label: 'collide',
        force: d3.forceCollide(this.radius + this.buffer)
      })

      let neutralForceStrength = (node, i) => {
        return node.player.choiceIndex === -1 ? 0.06 : 0;
      }
      choiceForces.push({
        label: 'neutralX',
        force: d3.forceX(this.width/2).strength(neutralForceStrength)
      })
      choiceForces.push({
        label: 'neutralY',
        force: d3.forceY(this.height * 0.85).strength(neutralForceStrength)
      })

      // choiceForces.push({
      //   label: "centering",
      //   force: d3.forceCenter(this.width/2, this.height/2)
      // })

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
