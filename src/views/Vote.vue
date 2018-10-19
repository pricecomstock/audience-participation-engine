<template>
  <div class="container">
    <div v-for="(choice, index) in choices" class="button" @click="vote(index)" :key="index">{{ choice }}</div>
    {{resultString}}
  </div>
</template>

<script>
export default {
  name: "vote",
  data() {
    return {
      votes: [],
      choices: []
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    results: function(newVotes) {
      console.log(
        'received results from server', newVotes
      );
      // the votes come in the form of indices
      // have to remap them to actual choices
      this.votes = newVotes.map( voteIndex => this.choices[voteIndex]);
    },
    startVote: function(newChoices) {
      console.log('starting vote with choices', newChoices);
      this.choices = newChoices;
    }
  },
  methods: {
    vote(choiceIndex) {
      console.log("voted", choiceIndex);
      this.$socket.emit("vote", choiceIndex);
    }
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
