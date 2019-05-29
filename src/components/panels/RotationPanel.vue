<template>
  <div class="form-element thirds">
    <label>Rotation:</label>
    <input v-model.number="x" type="number">
    <input v-model.number="y" type="number">
    <input v-model.number="z" type="number">
  </div>
</template>

<script>
export default {
  name: "RotationPanel",
  computed: {
    x: {
      get() {
        return this.$store.state.selectionGroup.rotation.x;
      },
      set(value) {
        this.$store.state.selectionGroup.rotation.x = value;
        this.$store.dispatch("updateLEDConnections", this.$store.state.selectionGroup.children);
      }
    },
    y: {
      get() {
        return this.$store.state.selectionGroup.rotation.y;
      },
      set(value) {
        this.$store.state.selectionGroup.rotation.y = value;
        this.$store.dispatch("updateLEDConnections", this.$store.state.selectionGroup.children);
      }
    },
    z: {
      get() {
        return this.$store.state.selectionGroup.rotation.z;
      },
      set(value) {
        this.$store.state.selectionGroup.rotation.z = value;
        this.$store.dispatch("updateLEDConnections", this.$store.state.selectionGroup.children);
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
