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
    results: function(newVotes) {
      console.log("received results from server", newVotes);
      // the votes come in the form of indices
      // have to remap them to actual choices
      this.votes = newVotes.map(voteIndex => this.choices[voteIndex]);
    },
    startVote: function(newChoices) {
      console.log("starting vote with choices", newChoices);
      this.choices = newChoices;
    },
    broadcast: function(data) {
      console.log("broadcast:", data)
    }
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
