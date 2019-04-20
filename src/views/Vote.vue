<template>
  <div class="container">
    <div class="level is-mobile">
      <div class="level-left">
        <!-- <div class="tags has-addons">
          <span class="tag is-dark is-large is-rounded">{{
            localPlayer.nickname
          }}</span>
        </div> -->
        <p class="is-size-2" @click="showEditPlayerInfo = !showEditPlayerInfo">
          {{ localPlayer.emoji }}
        </p>
        <button
          class="button is-inverted is-primary"
          @click="showEditPlayerInfo = !showEditPlayerInfo"
        >
          Change Emoji
        </button>
      </div>
      <div class="level-right">
        <button
          v-if="isDisconnected"
          class="button is-medium"
          @click="connectToThisRoom()"
        >
          <span class="icon"><i class="fas fa-sync-alt"></i></span>
        </button>
        <span class="tag is-large is-danger" v-if="showFlag">FLAG</span>
      </div>
    </div>
    <!-- <div>
      <span class="tag is-small is-warning">id: {{ playerId }}</span>
    </div> -->

    <div class="buttons">
      <div
        :disabled="locked || cooldown || index === localPlayer.choiceIndex"
        v-for="(choice, index) in choices"
        :key="index"
        class="button is-large"
        :class="{
          'is-fullwidth': choices.length <= 3,
          'is-primary': index === localPlayer.choiceIndex
        }"
        @click="vote(index)"
      >
        {{ choice }}
      </div>
    </div>

    <section class="hero" v-if="locked">
      <div class="hero-body">
        <div class="container">
          <span class="icon is-large has-text-danger">
            <i class="fas fa-3x fa-lock"></i>
          </span>
        </div>
      </div>
    </section>

    <edit-player-info
      :class="{ 'is-active': showEditPlayerInfo }"
      @close="showEditPlayerInfo = false"
      :is-open="showEditPlayerInfo"
      :previousEmoji="this.localPlayer.emoji"
      :previousNickname="this.localPlayer.nickname"
    ></edit-player-info>
  </div>
</template>

<script>
import EditPlayerInfo from "@/components/EditPlayerInfo.vue";

function registerMissedHeartbeatFunction(fn) {
  var lastIntervalTime = new Date().getTime();
  const heartbeatIntervalMs = 1000;
  function heartbeat() {
    let now = new Date().getTime();
    let diff = now - lastIntervalTime;
    lastIntervalTime = now;
    // console.log(diff);
    if (diff > heartbeatIntervalMs + 150) {
      console.log("Heartbeat missed, calling registered function");
      fn();
    }
  }
  setInterval(heartbeat, heartbeatIntervalMs);
}

export default {
  name: "vote",
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      players: [], // TODO This may not be needed
      voteValues: [],
      choices: [],
      locked: false,
      localPlayer: {
        nickname: "human",
        emoji: "😀",
        choiceIndex: -1
      },
      playerId: "",
      showEditPlayerInfo: false,
      cooldown: false,
      heartbeatIntervalMs: 1000,
      heartbeatIntervalId: 0,
      lastIntervalTime: 0,
      showFlag: false
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    disconnect: function(reason) {
      console.log("disconnected", reason);
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

      this.localPlayer = this.players.find(player => {
        return player.playerId === this.playerId;
      });

      this.voteValues = this.players.map(player => {
        return this.choices[player.choiceIndex];
      });
    },
    playerIdAssigned: function(id) {
      this.playerId = id;
      localStorage.setItem(this.id, this.playerId);
      console.log("Assigned ID", id);
    },
    reconnect: function(_attempts) {
      this.setPlayerActive();
    }
    // startVote: function(newChoices) {
    //   console.log("starting vote with choices", newChoices);
    //   this.choices = newChoices;
    // }
  },
  methods: {
    vote(choiceIndex) {
      if (
        !this.locked &&
        !this.cooldown &&
        choiceIndex !== this.localPlayer.choiceIndex
      ) {
        this.$socket.emit("vote", choiceIndex);
        this.startCooldown();
      }
    },
    joinRoom(roomCode) {
      let existingPlayerIdForRoom = localStorage.getItem(roomCode);
      console.log("existing id", existingPlayerIdForRoom);
      this.$socket.emit("room", {
        roomCode: roomCode,
        requestedId: existingPlayerIdForRoom
      });
      // FIXME This is definitely not a 100% thing but should work as long as no one tries to reconn to a closed room
      if (!existingPlayerIdForRoom) {
        this.showEditPlayerInfo = true;
      }
    },
    setPlayerActive() {
      this.$socket.emit("playerreconnect", "");
    },
    startCooldown() {
      this.cooldown = true;
      setTimeout(this.endCooldown, 1500);
    },
    endCooldown() {
      this.cooldown = false;
    },
    connectToThisRoom() {
      this.joinRoom(this.id);
    },
    disconnect() {
      this.$socket.close();
    }
  },
  computed: {
    isDisconnected() {
      return this.$socket.disconnected;
    }
  },
  mounted() {
    this.connectToThisRoom();
    registerMissedHeartbeatFunction(this.connectToThisRoom);
    // window.addEventListener("blur", this.handlePhoneAsleep.bind(context, true));
  },
  components: {
    editPlayerInfo: EditPlayerInfo
  }
};
</script>

<style></style>
