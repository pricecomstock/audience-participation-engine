<template>
    
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
  },
  components: {
    pcnav: Nav,
    pcfoot: Footer
  }
};
</script>
</script>

<style>

</style>
