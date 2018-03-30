<template>
  <div>
    {{testData}}
  </div>
</template>

<script>
export default {
  name: 'guntest',
  data () {
    return {
        testData: null
    }
  },
  methods: {

  },
  created () {
      this.$gun.get('users').on( (data, key) => this.testData=data)
  }
}
</script>

<style lang="scss">
</style>
