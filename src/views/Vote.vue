<template>
  <div class="container">
    <div class="tags has-addons">
      <span class="tag is-light is-large is-rounded">{{localPlayer.emoji}}</span>
      <span class="tag is-dark is-large is-rounded">{{localPlayer.nickname}}</span>
    </div>
    <div>
      <span class="tag is-small is-warning">id: {{ playerId }}</span>
    </div>
    <div>
      <button class="button is-white" @click="showEditPlayerInfo = !showEditPlayerInfo">edit player info</button>
    </div>

    <div v-for="(choice, index) in choices" class="button is-large" @click="vote(index)" :key="index">{{ choice }}</div>
    
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
      players: [], // TODO This may not be needed
      voteValues: [],
      choices: [],
      localPlayer: {
        nickname: "",
        emoji: ""
      },
      playerId: "",
      showEditPlayerInfo: false
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

      this.localPlayer = this.players.find( player => {
        return player.playerId === this.playerId;
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
