<template>
  <div>
    Scale:
    <br>
    <input v-model.number="x" type="number" class="third">
    <input v-model.number="y" type="number" class="third">
    <input v-model.number="z" type="number" class="third">
  </div>
</template>

<script>
export default {
  name: "ScalePanel",
  computed: {
    x: {
      get() {
        return this.$store.state.selectionGroup.scale.x;
      },
      set(value) {
        this.$store.state.selectionGroup.scale.x = value;
      }
    },
    y: {
      get() {
        return this.$store.state.selectionGroup.scale.y;
      },
      set(value) {
        this.$store.state.selectionGroup.scale.y = value;
      }
    },
    z: {
      get() {
        return this.$store.state.selectionGroup.scale.z;
      },
      set(value) {
        this.$store.state.selectionGroup.scale.z = value;
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
