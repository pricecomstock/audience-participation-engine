<template>
    <div>
      <div>room code: {{ id }}</div>
      <p>{{resultString}}</p>
      <!-- <button class="button" @click="broadcast({msg: 'test'})">Broadcast</button> -->
    </div>
    <!-- TODO: This is where all the d3.js stuff will go -->
</template>

<script>
export default {
  name: 'watch',
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      votes: [],
      choices: [],
      playerChoices: {}
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
      this.playerChoices = newState.playerChoices;
      console.table(Object.entries(this.playerChoices))
    }
  },
  methods: {
    joinRoom(room) {
      this.$socket.emit("room", room);
    }
  },
  computed: {
    resultString() {
      let results = ''
      Object.entries(this.playerChoices).forEach( pair => {
        results += `${pair[0]} votes: ${pair[1]}\n`
      })
      return results
    }
  },
  mounted() {
    this.joinRoom(this.id);
  }
};
</script>

<style>
</style>
