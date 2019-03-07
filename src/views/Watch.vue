<template>
  <div>
    <div class="columns is-centered">
      <div class="column is-11">
        <button
          class="button is-outlined is-primary"
          @click="fullScreenElementWithId('vote-chart-container')"
        >
          <span class="icon is-medium">
            <i class="fas fa-expand"></i>
          </span>
          <span>Fullscreen</span>
        </button>
        <br />
        <div class="section">
          <div id="vote-chart-container">
            <vote-chart :roomCode="id" :gameState="gameState"></vote-chart>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-centered">
      <div class="column is-half">
        <span class="tag is-warning is-large">{{ id }}</span>
        <div class="box" v-if="debug">
          <div class="button" @click="addDummyPlayer()">Add Dummy Player</div>
          <div class="button" @click="removeDummyPlayer()">
            Remove Dummy Player
          </div>
        </div>
        <div class="box">
          <label class="label">Current Choices</label>
          <div class="tags">
            <span
              class="tag is-light is-large"
              v-for="(choice, index) in choices"
              :key="index"
              >{{ choice }}</span
            >
          </div>
        </div>
        <div class="box">
          <div class="field">
            <label class="label">New Choices</label>
            <div class="control">
              <textarea
                class="textarea"
                placeholder="enter one choice per line"
                v-model.trim="newChoices"
              ></textarea>
            </div>
          </div>
          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <button
                v-if="!locked"
                class="button is-success is-outlined"
                @click="lockVotes()"
              >
                Lock Votes
              </button>
              <button v-else class="button is-danger" @click="unlockVotes()">
                Unlock Votes
              </button>
            </div>
            <div class="control">
              <button
                class="button is-warning is-outlined"
                @click="resetVotes()"
              >
                Reset Votes
              </button>
            </div>
            <div class="control">
              <button class="button" @click="submitNewChoices(newChoicesList)">
                New Choices
              </button>
            </div>
          </div>
        </div>
        <div class="box">
          <table class="table is-fullwidth is-striped">
            <thead>
              <th>emoji</th>
              <th>id</th>
              <th>nickname</th>
              <th>choice#</th>
              <th>value</th>
            </thead>
            <tbody>
              <tr v-for="(player, index) in players" :key="index">
                <td>{{ player.emoji }}</td>
                <td>{{ player.playerId }}</td>
                <td>{{ player.nickname }}</td>
                <td>{{ player.choiceIndex }}</td>
                <td>{{ player.choiceValue }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- <button class="button" @click="broadcast({msg: 'test'})">Broadcast</button> -->
  </div>
  <!-- TODO: https://github.com/mathisonian/d3moji -->
</template>

<script>
import VoteChart from "@/components/VoteChart.vue";

export default {
  name: "watch",
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      players: [],
      voteValues: [],
      choices: [],
      newChoices: "",
      debug: false,
      dummyPlayers: [],
      locked: false
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    state: function(newState) {
      console.log("received results from server", newState);
      // the votes come in the form of indices
      // have to remap them to actual choices
      this.choices = newState.choices;
      this.players = newState.players.map(player => {
        player.choiceValue = "";
        if (player.choiceIndex !== -1) {
          player.choiceValue = this.choices[player.choiceIndex];
        }
        return player;
      });
      this.locked = newState.locked;

      this.voteValues = this.players.map(player => {
        return this.choices[player.choiceIndex];
      });
    }
  },
  methods: {
    joinRoomAsAdmin(roomCode) {
      this.$socket.emit("roomadminjoin", {
        roomCode: roomCode
        //TODO Add admin key
      });
    },
    submitNewChoices() {
      //TODO Add admin key
      this.$socket.emit("newchoices", this.newChoicesList);
    },
    resetVotes() {
      this.$socket.emit("resetvotes", "");
    },
    lockVotes() {
      this.$socket.emit("lockvotes", true);
    },
    unlockVotes() {
      this.$socket.emit("lockvotes", false);
    },
    addDummyPlayer() {
      this.dummyPlayers.push({
        emoji: "👻",
        playerId: `xyz${Math.random()}`,
        nickname: "ghost",
        choiceIndex: Math.floor(Math.random() * (this.choices.length + 1) - 1),
        choiceValue: ""
      });
    },
    removeDummyPlayer() {
      this.dummyPlayers.shift();
    },
    fullScreenElementWithId(id) {
      var elem = document.getElementById(id);
      elem.focus();
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }
  },
  computed: {
    newChoicesList() {
      return this.newChoices.split("\n").map(choice => {
        return choice.trim();
      });
    },
    gameState() {
      return {
        choices: this.choices,
        players: this.players,
        locked: this.locked
      };
    },
    dummyGameState() {
      let dummyState = {
        choices: this.choices.slice(0),
        players: this.dummyPlayers.slice(0).concat(this.players),
        locked: this.locked
      };

      return dummyState;
    }
  },
  mounted() {
    this.joinRoomAsAdmin(this.id);
  },
  components: {
    voteChart: VoteChart
  }
};
</script>

<style></style>
