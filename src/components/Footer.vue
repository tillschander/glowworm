<template>
    <div class="footer">
      <select v-model="maxFps">
        <option>1</option>
        <option>5</option>
        <option>15</option>
        <option>30</option>
        <option>60</option>
      </select>
      FPS: {{ this.$store.state.fps }}
    </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      maxFps: 60
    };
  },
  watch: {
    maxFps: function() {
      this.$store.commit('setMaxFps', this.maxFps);
    }
  }
}
</script>

<style scoped lang="scss">
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
}
</style>
