<template>
  <div id="app">
    <pcnav></pcnav>
    <div class="section">
      <div class="container">
        <div class="button" @click="vote('yes')">hell yeah!</div>
        <div class="button" @click="vote('no')">no way!</div>
        {{resultString}}
      </div>
    </div>
    <pcfoot></pcfoot>
  </div>
</template>

<script>
import Nav from "@/components/nav/Nav.vue";
import Footer from "@/components/nav/Footer.vue";

export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      votes: []
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    results: function(votes) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("customEmit", data)'
      );
      this.votes = votes;
    }
  },
  methods: {
    vote(value) {
      console.log("voted", value);
      this.$socket.emit("vote", value);
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

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
