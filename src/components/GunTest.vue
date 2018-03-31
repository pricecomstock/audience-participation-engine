<template>
  <div>
    <p>{{testData}}</p>
    <p>{{testId}}</p>
    <button class="button" @click="addVote(true)">Yes</button>
    <button class="button" @click="addVote(false)">No</button>
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
      addVote(isYesVote) {
          // idk if this is very javascripty
          // python yolo
          let voteObject = {}
          voteObject[this.generateRandomId()] = isYesVote
          this.$gun.get('LYBy').put(voteObject)
      }
  },
  created () {
    //   this.$gun.get(this.testId).on( (data, key) => {
      this.$gun.get('LYBy').on( (data, key) => {
          console.log(data)
          console.log(key)
          this.testData=data
        })
  }
}
</script>

<style lang="scss">
</style>