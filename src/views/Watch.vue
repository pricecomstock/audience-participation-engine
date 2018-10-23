<template>
    <div>
      <div>room code: {{ id }}</div>
      <div class="columns is-centered">
        <div class="column">
          <div class="box">
            <table class="table">
              <thead>
                <th>emoji</th>
                <th>id</th>
                <th>nickname</th>
                <th>choice#</th>
                <th>value</th>
              </thead>
              <tbody>
                <tr v-for="(player, index) in players" :key="index">
                  <td>{{player.emoji}}</td>
                  <td>{{player.playerId}}</td>
                  <td>{{player.nickname}}</td>
                  <td>{{player.choiceIndex}}</td>
                  <td>{{player.choiceValue}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- <button class="button" @click="broadcast({msg: 'test'})">Broadcast</button> -->
    </div>
    <!-- TODO: https://github.com/mathisonian/d3moji -->
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
      players: [],
      voteValues: [],
      choices: []
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
    }
  },
  methods: {
    joinRoomAsAdmin(room) {
      this.$socket.emit("room", room);
    }
  },
  mounted() {
    this.joinRoomAsAdmin(this.id);
  }
};
</script>

<style>
</style>
