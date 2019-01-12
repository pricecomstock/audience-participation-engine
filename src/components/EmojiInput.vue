<template>
<!-- @input="$emit('input', $event.target.value.charAt(0))"
      :value="value" -->
    <input
      v-model="emojiModel"
      class="input is-medium"
      type="text"
      placeholder="😀">
</template>

<script>
import "string.prototype.at";
export default {
  props: {
    value: {
      required: true
    }
  },
  computed: {
    emojiModel: {
      get() {
        return this.value;
      },
      set(v) {
        // console.log(v.at(0))
        this.$emit("input", v.at(0));
      }
    }
  },
  methods: {
    // onInput() {
    //   this.$emit("input", v.charAt(0))
    // }
  }
};
</script>

<style>
.emoji-input {
  width: 75px;
}
</style>
