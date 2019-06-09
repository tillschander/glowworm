<template>
  <div class="mixer-sidebar">
    <label>Mix:</label>
    <input type="range" v-model="mix" min="0" max="1" step="0.01">
    <br>
    <label>Opacity:</label>
    <input type="range" v-model="opacity" min="0" max="1" step="0.01">
  </div>
</template>

<script>
export default {
  name: "MixerSidebar",
  computed: {
    mix: {
      get() {
        return this.$store.state.mixValue;
      },
      set(value) {
        this.$store.commit("setMixValue", parseFloat(value));
        this.$store.state.leds.activeMaterial.uniforms.mixValue.value = parseFloat(value);
        this.$store.state.bufferMaterial.uniforms.mixValue.value = parseFloat(value);
      }
    },
    opacity: {
      get() {
        return this.$store.state.globalOpacity;
      },
      set(value) {
        this.$store.commit("setGlobalOpacity", parseFloat(value));
        this.$store.state.leds.activeMaterial.uniforms.globalOpacity.value = parseFloat(value);
        this.$store.state.bufferMaterial.uniforms.globalOpacity.value = parseFloat(value);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.mixer-sidebar {
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: #424242;
  overflow-y: auto;
}
</style>