<template>
  <div class="animations-sidebar">Animations:
    <br>====
    <div v-bind:key="animation.uuid" v-for="animation in this.$store.state.animations">
      {{ animation }}
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnimationsSidebar"
};
</script>

<style scoped lang="scss">
.animations-sidebar {
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: #424242;
  overflow-y: auto;
}
</style>
