<template>
  <div class="columns is-centered">
    <div class="column is-one-third">
      <div class="field">
        <label class="label is-large">ROOM NAME</label>
        <div class="control">
          <input
            class="input is-large"
            v-model="roomName"
            @keyup.enter="createRoom()"
          />
        </div>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <a
            class="button is-large is-primary"
            @click="createRoom()"
            @keydown.enter="createRoom()"
          >
            CREATE
          </a>
        </p>
        <p class="control">
          <a class="button is-large is-white">
            Cancel
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "@/axios-backend";

export default {
  name: "create",
  data() {
    return {
      roomName: ""
    };
  },
  methods: {
    createRoom() {
      axios
        .post("/createroom", {
          name: this.roomName
        })
        .then(response => {
          // TODO: Vuex the adminKey
          // const adminKey = response.data.adminKey
          this.$router.push(`/watch/${response.data.code}`);
        });
    }
  },
  mounted() {
    // axios.get("http://google.com");
  }
};
</script>
