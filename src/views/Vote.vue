<template>
  <div class="container">
    <div>
      <span class="tag is-small is-warning">id: {{ playerId }}</span>
    </div>

    <div v-for="(choice, index) in choices" class="button is-large" @click="vote(index)" :key="index">{{ choice }}</div>
    {{resultString}}

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
      this.votes = newState.voteValues.map(voteIndex => this.choices[voteIndex]);
      this.choices = newState.choices;
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
    },
    submitNewInfo() {
      this.editPlayerInfo
    }
  },
  mounted() {
    this.joinRoom(this.id);
  },
  computed: {
    resultString() {
      const yesSymbol = "✅";
      const noSymbol = "❌";
      let results = "";

      for (let v in this.votes.filter(vote => vote === "yee")) {
        results += yesSymbol;
      }
      for (let v in this.votes.filter(vote => vote === "nah")) {
        results += noSymbol;
      }

      return results;
    }
  },
  components: {
    editPlayerInfo: EditPlayerInfo
  }
};
</script>

<style>
</style>
