<template>
  <div class="field">
    <label class="label is-large">Emoji</label>
    <div class="control emoji-input">
      <input 
        class="input is-large"
        type="text"
        placeholder="😀">
    </div>
  </div>
</template>

<script>
import emojiRegex from 'emoji-regex'
export default {
  data() {
    return {
      input: ''
    }
  }
}
</script>

<style>
.emoji-input {
  width: 75px;
}
</style>
