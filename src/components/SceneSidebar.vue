<template>
  <div class="scene-sidebar">Scene:
    <br>=====
    <SceneObject v-for="(LED, uuid) in this.$store.state.LEDs" v-bind:key="uuid" v-bind:uuid="uuid"></SceneObject>
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
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #424242;

  :nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>
