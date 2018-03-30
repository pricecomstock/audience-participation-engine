<template>
  <div>
    <p>{{testData}}</p>
    <p>{{testId}}</p>
    <button class="button" @click="addYesVote">Yes</button>
    <button class="button" @click="addNoVote">No</button>
  </div>
</template>

<script>
import crypto from 'crypto'
export default {
  name: 'guntest',
  data () {
    return {
        testData: null,
        testId: this.generateRandomId()
    }
  },
  methods: {
      generateRandomId () {
        const NUM_BYTES = 3; // 3 bytes = 4 base 64 characters
        const buf = crypto.randomBytes(NUM_BYTES); 
        return buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
      },
      addYesVote() {
          this.$gun.get('votes/TESTVOTES').set({id:this.testId, vote: true})
      },
      addNoVote() {
          this.$gun.get('votes/TESTVOTES').set({id:this.testId, vote: false})
      }
  },
  created () {
      this.$gun.get('votes/TESTVOTES').on( (data, key) => this.testData=data)
  }
}
</script>

<style lang="scss">
</style>