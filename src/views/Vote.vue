<template>
  <div class="container">
    <div v-for="(choice, index) in choices" class="button" @click="vote(index)" :key="index">{{ choice }}</div>
    {{resultString}}
  </div>
</template>

<script>
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
      playerName: "xyz" // TODO Make not static
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
    }
    // startVote: function(newChoices) {
    //   console.log("starting vote with choices", newChoices);
    //   this.choices = newChoices;
    // }
  },
  methods: {
    vote(choiceIndex) {
      let voteInfo = {
        choiceIndex: choiceIndex,
        playerName: this.playerName,
        room: this.id
      };
      console.table(voteInfo);
      this.$socket.emit("vote", voteInfo);
    },
    joinRoom(room) {
      this.$socket.emit("room", room);
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

      for (let v in this.votes.filter(vote => vote === "yes")) {
        results += yesSymbol;
      }
      for (let v in this.votes.filter(vote => vote === "no")) {
        results += noSymbol;
      }

      return results;
    }
  }
};
</script>
</script>

<style>
</style>
