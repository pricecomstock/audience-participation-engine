<template>
  <div id="app">
    <pcnav></pcnav>
    <router-view></router-view>
    <div class="section">
      <div class="container">
        <div v-for="(choice, index) in choices" class="button" @click="vote(index)" :key="index">{{ choice }}</div>
        <!-- <div class="button" @click="vote('yes')">hell yeah!</div>
        <div class="button" @click="vote('no')">no way!</div> -->
        {{resultString}}
      </div>
    </div>
    <pcfoot></pcfoot>
  </div>
</template>

<script>
// TODO Move most of this functionality into Views and Components
import Nav from "@/components/nav/Nav.vue";
import Footer from "@/components/nav/Footer.vue";

export default {
  name: "app",
  data() {
    return {
    };
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
