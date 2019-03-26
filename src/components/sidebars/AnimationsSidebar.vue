<template>
  <div class="animations-sidebar">Animations:
    <br>====
    <div v-bind:key="animation.uuid" v-for="animation in this.$store.state.animations">
      {{ getNameFromUuid(animation.uuid) }}
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnimationsSidebar",
  methods: {
    getNameFromUuid: function(uuid) {
      let animation = this.$store.state.scene.getObjectByProperty("uuid", uuid);
      return animation.name ? animation.name : animation.userData.type;
    }
  }
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
