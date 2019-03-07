<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    width="100%"
    @click="continueSimulation()"
  >
    <text
      class="join-instructions"
      text-anchor="end"
      :x="width * 0.99"
      :y="height * 0.95"
    >
      {{ `enter ${roomCode} at testkitchen.fun` }}
    </text>
    <text
      v-if="gameState.locked"
      class="lock-notice"
      text-anchor="middle"
      :x="width * 0.5"
      :y="height * 0.83"
      fill="red"
    >
      LOCKED
    </text>
    <g v-for="(choice, index) in gameState.choices" :key="`zone${index}`">
      <rect
        :x="(width / gameState.choices.length) * index"
        :y="0"
        :width="width / gameState.choices.length"
        :height="height * 0.7"
        :fill="colors(index)"
      ></rect>
      <text
        class="zone-label"
        text-anchor="middle"
        :x="
          (width / gameState.choices.length) * index +
            width / gameState.choices.length / 2
        "
        :y="height * 0.05"
      >
        {{ choice }}
      </text>
      <text
        class="vote-count"
        text-anchor="middle"
        :x="
          (width / gameState.choices.length) * index +
            width / gameState.choices.length / 2
        "
        :y="height * 0.77"
      >
        {{
          gameState.players.filter(player => {
            return player.choiceIndex === index && player.connected;
          }).length
        }}
      </text>
    </g>
    <g v-for="(node, index) in nodes" :key="index">
      <!-- <circle :r="radius" :cx="node.x" :cy="node.y" :fill="node.color" fill-opacity="0" stroke="black" stroke-width="2px">
      </circle> -->
      <text
        :class="{ translucent: !node.player.connected }"
        :style="emojiClasses"
        text-anchor="middle"
        :x="node.x"
        :y="node.y"
      >
        {{ node.player.emoji }}
      </text>
    </g>
  </svg>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "vote-chart",
  props: {
    gameState: {
      required: true
    },
    roomCode: {
      required: true
    }
  },
  data() {
    return {
      width: 1920,
      height: 1080,
      nodes: null,
      root: null,
      line: "",
      simulation: null,
      // choiceNodes: null,
      // choiceSim: null,
      zones: [{ x: 0, y: 0 }],
      forces: [{ label: "posX0", force: d3.forceX(0) }],
      maxZonesHad: 0,
      colors: d3.scaleOrdinal(d3.schemePastel2),
      edgeBuffer: 10
    };
  },
  computed: {
    // FIXME gave up on this because it wasn't strictly necessary and was taking a while
    // voteCounts() {
    //   console.log("votecounts")
    //   let choiceIndices = gameState.players.map((player)=>{return player.choiceIndex})
    //   console.log(choiceIndices)
    //   choiceCounts = new Array(this.gameState.choices.length).fill(0)
    //   choiceIndices.forEach(choiceIndex => {
    //     choiceCounts[choiceIndex] += 1;
    //   })
    //   console.log(choiceCounts)

    //   return choiceCounts
    // },
    radius() {
      return this.radiusForPlayers(this.nodes.length);
    },
    buffer() {
      return 0;
    },
    emojiClasses() {
      return {
        "font-size": `${this.emojiFontSizeForRadius(this.radius)}em`,
        transform: `translateY(${this.emojiOffsetForRadius(this.radius)}em)`
      };
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
      this.nodes = this.gameState.players.map((player, i) => {
        return {
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          color: d3.gray(i * 2),
          player: player
        };
      });
    },
    syncNodes() {
      this.nodes = this.nodes.filter(node => {
        // remove players that have left
        return this.gameState.players.some(player => {
          // will be true if any gamestate players match playerId
          return node.player.playerId === player.playerId;
        });
      });

      // This should add any new gamestate players not in nodes
      this.gameState.players.forEach(player => {
        const alreadyInNodes = this.nodes.some(node => {
          // will be true if any nodes match playerId
          return node.player.playerId === player.playerId;
        });

        if (!alreadyInNodes) {
          this.addNode(player);
        }
      });

      this.nodes.forEach(node => {
        node.player = this.gameState.players.find(player => {
          return node.player.playerId === player.playerId;
        });
      });
    },
    addNode(player) {
      this.nodes.push({
        x: this.width / 2,
        y: this.height * 0.6,
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

      this.simulation.on("tick", _tickEvt => {
        this.$forceUpdate();
      });
      // this.force.initialize(this.nodes)
    },
    updateSimulationForces() {
      this.forces.forEach(f => {
        this.simulation.force(f.label, f.force);
      });
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
      let numChoices = this.gameState.choices.length;
      let bufferZone = (this.width * 0.5) / numChoices;
      // TODO better algorithm with vertical separation
      let xScale = d3
        .scaleLinear()
        .domain([0, numChoices - 1])
        .range([bufferZone, this.width - bufferZone]);

      let yScale = _index => {
        return this.height * 0.3;
      };

      this.zones = this.gameState.choices.map((choice, index) => {
        return {
          x: xScale(index),
          y: yScale(index)
        };
      });

      if (this.zones.length > this.maxZonesHad) {
        this.maxZonesHad = this.zones.length;
      }
    },
    calculateZoneForces() {
      let choiceForces = [];
      // TODO: use force.initialize instead of force.strength to select nodes
      this.gameState.choices.forEach((choice, index) => {
        choiceForces.push({
          label: `posX${index}`,
          force: d3.forceX(this.zones[index].x).strength((node, _i) => {
            return node.player.choiceIndex === index ? 0.08 : 0;
          })
        });
        choiceForces.push({
          label: `posY${index}`,
          force: d3.forceY(this.zones[index].y).strength((node, _i) => {
            return node.player.choiceIndex === index ? 0.03 : 0;
          })
        });
      });

      choiceForces.push({
        label: "collide",
        force: d3.forceCollide(this.radius + this.buffer)
      });

      // choiceForces.push({
      //   label: 'boundary',
      //   force: (alpha) => {}
      // })

      choiceForces.push({
        label: "neutralX",
        force: d3.forceX(this.width / 2).strength((node, _i) => {
          return node.player.choiceIndex === -1 ? 0.02 : 0;
        })
      });
      choiceForces.push({
        label: "neutralY",
        force: d3.forceY(this.height * 0.9).strength((node, _i) => {
          return node.player.choiceIndex === -1 ? 0.07 : 0;
        })
      });

      choiceForces.push({
        label: "dconX",
        force: d3.forceX(this.width * 0.05).strength((node, _i) => {
          return node.player.connected ? 0 : 0.08;
        })
      });
      choiceForces.push({
        label: "dconY",
        force: d3.forceY(this.height * 0.9).strength((node, _i) => {
          return node.player.connected ? 0 : 0.08;
        })
      });

      // choiceForces.push({
      //   label: "centering",
      //   force: d3.forceCenter(this.width/2, this.height/2)
      // })

      this.forces = choiceForces;
    },
    removeZoneForces() {
      d3.range(this.maxZonesHad).forEach(zoneIndex => {
        this.simulation.force(`posX${zoneIndex}`, null);
        this.simulation.force(`posY${zoneIndex}`, null);
      });
    },
    radiusForPlayers: d3
      .scaleLinear()
      .domain([0, 50])
      .range([30, 20]),
    emojiFontSizeForRadius: d3
      .scaleLinear()
      .domain([20, 30])
      .range([1.8, 2.8]),
    emojiOffsetForRadius: d3
      .scaleLinear()
      .domain([20, 30])
      .range([0.4, 0.31])
  },
  mounted() {
    this.createNodes();
    this.createSimulation();
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
};
</script>

<style lang="scss" scoped>
// svg {
//   margin: 25px;
//   path {
//     fill: none;
//     stroke: #76BF8A;
//     stroke-width: 3px
//   }
// }

.chartemoji {
  font-size: 1.8em;
  transform: translateY(7px);
}

.zone-label {
  text-transform: uppercase;
  font-size: 1.5em;
}

.vote-count {
  font-size: 2em;
}

.translucent {
  opacity: 0.3;
}

.join-instructions {
  font-size: 1.2em;
}

.lock-notice {
  font-size: 4em;
}
</style>
