<template>
  <div class="fader-sidebar">
    <label>Mix:</label>
    <input
      type="range"
      v-bind:value="mix"
      v-on:input="setMix($event.target.value)"
      min="0"
      max="1"
      step="0.01"
    >
    <br>
    <label>Opacity:</label>
    <input
      type="range"
      v-bind:value="opacity"
      v-on:input="setOpacity($event.target.value)"
      min="0"
      max="1"
      step="0.01"
    >
  </div>
</template>

<script>
export default {
  name: "FaderSidebar",
  data() {
    return {
      mix: 0.5,
      opacity: 1
    };
  },
  methods: {
    setMix: function(value) {
      this.mix = value;
    },
    setOpacity: function(value) {
      this.opacity = value;
    }
  }
};
</script>

<style scoped lang="scss">
.fader-sidebar {
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: #424242;
  overflow-y: auto;
}
</style>