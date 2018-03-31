<template>
  <div id="app">
    <div class="section">
      <div class="container">
        <gun-test></gun-test>
      </div>
    </div>
  </div>
</template>

<script>
import gunTest from './components/GunTest.vue'
export default {
  name: 'app',
  data () {
    return {
    }
  },
  components: {
    gunTest
  }
}
</script>

<style lang="scss">
</style>
