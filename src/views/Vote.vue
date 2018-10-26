<template>
  <div class="container">
    <div class="tags has-addons">
      <span class="tag is-large has-text-small" @click="showEditPlayerInfo = !showEditPlayerInfo">
        <span class="icon is-large">
          <i class="fas fa-edit"></i>
        </span>
      </span>
      <span class="tag is-dark is-large is-rounded">{{localPlayer.nickname}}</span>
      <span class="tag is-light is-large is-rounded">{{localPlayer.emoji}}</span>
    </div>
    <!-- <div>
      <span class="tag is-small is-warning">id: {{ playerId }}</span>
    </div> -->
    
    <div class="buttons">
      <div 
        :disabled="locked || cooldown"
        v-for="(choice, index) in choices" 
        :key="index" 
        class="button is-large" 
        :class="{'is-fullwidth': choices.length < 5, 'is-primary': index === localPlayer.choiceIndex}" 
        @click="vote(index)">{{ choice }}</div>
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
      :class="{'is-active': showEditPlayerInfo}" 
      @close="showEditPlayerInfo = false;" 
      :is-open="showEditPlayerInfo"
      :previousEmoji="this.localPlayer.emoji" 
      :previousNickname="this.localPlayer.nickname"></edit-player-info>
  </div>
</template>

<script>
import EditPlayerInfo from '@/components/EditPlayerInfo.vue';

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
      cooldown: false
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    disconnect: function(reason) {
      console.log("disconnected", reason)
    },
    state: function(newState) {
      console.log("received results from server", newState);
      // the votes come in the form of indices
      // have to remap them to actual choices
      this.choices = newState.choices;
      this.players = newState.players.map( (player) => {
        player.choiceValue = "";
        if (player.choiceIndex !== -1) {
          player.choiceValue = this.choices[player.choiceIndex]
        }
        return player;
      })

      this.locked = newState.locked;

      this.localPlayer = this.players.find( player => {
        return player.playerId === this.playerId;
      })

      this.voteValues = this.players.map(player => {return this.choices[player.choiceIndex]});
    },
    playerIdAssigned: function(id) {
      this.playerId = id;
      sessionStorage.setItem(this.id, this.playerId)
      console.log("Assigned ID", id);
    },
    reconnect: function(attempts) {
      this.setPlayerActive();
    }
    // startVote: function(newChoices) {
    //   console.log("starting vote with choices", newChoices);
    //   this.choices = newChoices;
    // }
  },
  methods: {
    vote(choiceIndex) {
      // let voteInfo = {
      //   choiceIndex: choiceIndex,
      //   playerName: this.playerName,
      //   room: this.id
      // };
      // console.table(voteInfo);
      if (!this.locked && !this.cooldown) {
        this.$socket.emit("vote", choiceIndex);
        this.startCooldown();
      }
    },
    joinRoom(roomCode) {
      let existingPlayerIdForRoom = sessionStorage.getItem(roomCode);
      console.log("existing id", existingPlayerIdForRoom)
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
      setTimeout(this.endCooldown, 1500)
    },
    endCooldown() {
      this.cooldown = false;
    }
  },
  mounted() {
    this.joinRoom(this.id);
  },
  components: {
    editPlayerInfo: EditPlayerInfo
  }
};
</script>

<style>
</style>
