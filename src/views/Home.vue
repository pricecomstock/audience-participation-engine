<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <br>
    <div class="columns is-centered is-mobile">
      <div class="column is-one-quarter-tablet is-two-thirds-mobile">
        <div class="field has-addons is-expanded">
          <div class="control is-expanded">
            <input class="input is-large is-uppercase" type="text" placeholder="Code">
          </div>
          <div class="control">
            <a class="button is-primary is-large">
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
import axios from "axios";

export default {
  name: "home",
  mounted() {
    // axios.get("http://google.com");
    console.log(process.env.BASE_URL)
  }
};
</script>
