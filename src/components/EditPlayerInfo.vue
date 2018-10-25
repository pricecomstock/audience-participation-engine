<template>
  <div class="modal">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-content">
      <div class="box has-text-left">
        <div class="field">
          <label class="label is-large">Emoji</label>
          <div class="control emoji-input">
            <emoji-input @keydown.enter="submit()" v-model="emoji"></emoji-input>
          </div>
        </div>
        <div class="field">
          <label class="label is-large">Display Name</label>
          <div class="control">
            <input @keydown.enter="submit()" class="input is-large" type="text" placeholder="human" v-model="nickname">
          </div>
          <!-- FIXME There is a bug with pressing enter on nickname on mobile, though emoji works-->
        </div>
        <div class="field is-grouped is-grouped-right">
          <p class="control">
            <a class="button is-white is-large" @click="close()">
              Cancel
            </a>
          </p>
          <p class="control">
            <a class="button is-primary is-large" @click="submit()">
              Submit
            </a>
          </p>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close()"></button>
  </div>
</template>

<script>
import EmojiInput from '@/components/EmojiInput.vue';

export default {
  props: ['previousEmoji', 'previousNickname', 'isOpen'],
  data() {
    return {
      nickname: '',
      emoji: ''
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submit() {
      console.log("submitted");
      if (this.emoji !== "") {
        this.$socket.emit("updateplayerinfo", {
          nickname: this.nickname,
          emoji: this.emoji
        });
        this.close();
      }
    }
  },
  components: {
    emojiInput: EmojiInput
  },
  watch: {
    isOpen() {
      this.nickname = this.previousNickname;
      this.emoji = this.previousEmoji;
    }
  }
}
</script>

<style>

</style>
