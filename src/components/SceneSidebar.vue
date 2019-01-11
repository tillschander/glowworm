<template>
  <div class="scene-sidebar">
    <SceneObject
      v-for="(LED, uuid) in this.$store.state.LEDs"
      v-bind:key="uuid"
      v-bind:uuid="uuid"
    ></SceneObject>
  </div>
</template>

<script>
import SceneObject from "./SceneObject.vue";

export default {
  name: "SceneSidebar",
  components: {
    SceneObject
  }
};
</script>

<style scoped lang="scss">
.scene-sidebar {
  position: absolute;
  top: 60px;
  right: 0;
  bottom: 60%;
  width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
