<template>
  <!-- @input="$emit('input', $event.target.value.charAt(0))"
      :value="value" -->
  <input
    v-model="emojiModel"
    class="input is-large"
    type="text"
    placeholder="😀"
    @focus="emojiModel = ''"
  />
</template>

<script>
var _;
import "lodash";
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
        this.$emit("input", _.toArray(v)[0]);
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
