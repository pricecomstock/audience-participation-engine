<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item placeholder-logo" to="/" disabled>
        <span class="icon is-medium">
          <i class="fas fa-lg fa-flask"></i>
        </span>
        <span>{{ appName }}</span>
      </router-link>
      <!--wow these are the 3 bars of the hamburger icon-->
      <!-- <div
        class="navbar-burger"
        :class="{ 'is-active': showNav }"
        @click="showNav = !showNav"
        data-target="navMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </div> -->
    </div>
    <!-- <div class="navbar-menu" :class="{'is-active':showNav}" id="navMenu">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/home" exact-active-class="is-active">Home</router-link>
        <div class="navbar-item has-dropdown is-hoverable" @mouseover="showTopDropdown = true" @mouseout="showTopDropdown = false">
          <router-link class="navbar-link" to="/about" :class="{'is-active': inAbout }">About</router-link>
          <div class="navbar-dropdown">
            <router-link class="navbar-item" to="/about">One</router-link>
            <router-link class="navbar-item" to="/about">Two</router-link>
            <router-link class="navbar-item" to="/about">Three</router-link>
            <router-link class="navbar-item" to="/about">Four</router-link>
          </div>
        </div>
      </div> -->
    <!-- <div class="navbar-end">
        <div class="navbar-item" v-if="!showNav">
          <div class="field">
            <p class="control">
              <router-link class="button is-white" to="/" tag="a">
                Submit
                <span class="icon">
                  <i class="fas fa-download"></i>
                </span>
              </router-link>
            </p>
          </div>
        </div>
        <router-link v-else class="navbar-item" to="/">Submit</router-link>
      </div>
    </div>-->
  </nav>
</template>

<script>
import details from "@/details.js";
export default {
  name: "NavBar",
  data() {
    return {
      showNav: false,
      appName: details.appTitle
    };
  },
  computed: {
    inAbout() {
      return this.$route.path.includes("/about");
    }
  },
  methods: {
    toggleHamburgerMenu() {
      this.showNav = !this.showNav;
    }
  }
};
</script>

<style>
.placeholder-logo span {
  /* font-style: italic; */
  font-weight: bold;
  /* text-transform: uppercase; */
}

.placeholder-logo .icon {
  margin-right: 0.5rem;
}
</style>
