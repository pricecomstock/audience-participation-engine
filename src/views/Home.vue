<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <br>
    <div class="columns is-centered is-mobile">
      <div class="column is-one-quarter-tablet is-two-thirds-mobile">
        <div class="field has-addons is-expanded">
          <div class="control is-expanded">
            <input class="input is-large is-uppercase" type="text" placeholder="Code" v-model.trim="code" @keydown.enter="joinRoom()">
          </div>
          <div class="control">
            <a class="button is-primary is-large" @click="joinRoom()">
              JOIN
            </a>
          </div>
        </div>
        <router-link to="create" class="button is-white" tag="a">CREATE</router-link>
      </div>
    </div>
    <br>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "@/axios-backend";

export default {
  name: "home",
  data() {
    return {
      code: ''
    }
  },
  methods: {
    joinRoom() {
      // TODO: Move this to another file
      axios
        .post("/checkroom", {
          code: this.code
        })
        .then(response => {
          console.log(response)
          if (response.data.success === true) {
            this.$router.push(`/vote/${response.data.code}`);
          }
      });
    }
  },
  mounted() {
    // axios.get("http://google.com");
    console.log(process.env.BASE_URL);
  }
};
</script>
