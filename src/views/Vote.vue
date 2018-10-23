<template>
  <div class="container">
    <div>
      <span class="tag is-small is-warning">id: {{ playerId }}</span>
    </div>

    <div v-for="(choice, index) in choices" class="button is-large" @click="vote(index)" :key="index">{{ choice }}</div>

    <div>
      <button class="button" @click="showEditPlayerInfo = !showEditPlayerInfo">Change player settings</button>
    </div>
    
    <edit-player-info :class="{'is-active': showEditPlayerInfo}" @close="showEditPlayerInfo = false;"></edit-player-info>
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
      votes: [],
      choices: [],
      playerName: "newplayer", // TODO Make not static
      playerEmoji: "😁",
      playerId: "",
      showEditPlayerInfo: false,
      editedPlayerInfo: {
        name: "",
        emoji: ""
      }
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
      this.players = newState.players.map( (player) => {
        player.choiceValue = "";
        if (player.choiceIndex !== -1) {
          player.choiceValue = this.choices[player.choiceIndex]
        }
        return player;
      })

      this.voteValues = this.players.map(player => {return this.choices[player.choiceIndex]});
    },
    playerIdAssigned: function(id) {
      this.playerId = id;
      sessionStorage.setItem(this.id, this.playerId)
      console.log("Assigned ID", id);
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
      this.$socket.emit("vote", choiceIndex);
    },
    joinRoom(room) {
      this.$socket.emit("room", room);
      this.showEditPlayerInfo = true;
    },
    submitNewInfo() {
      this.editPlayerInfo
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
