<template>
  <div>
    Position:
    <br>
    <input v-model.number="x" type="number" class="third">
    <input v-model.number="y" type="number" class="third">
    <input v-model.number="z" type="number" class="third">
  </div>
</template>

<script>
export default {
  name: "PositionPanel",
  computed: {
    x: {
      get() {
        return this.$store.state.selectionGroup.position.x;
      },
      set(value) {
        this.$store.state.selectionGroup.position.x = value;
        this.$store.dispatch("updateLEDConnections", this.$store.state.selectionGroup.children);
      }
    },
    y: {
      get() {
        return this.$store.state.selectionGroup.position.y;
      },
      set(value) {
        this.$store.state.selectionGroup.position.y = value;
        this.$store.dispatch("updateLEDConnections", this.$store.state.selectionGroup.children);
      }
    },
    z: {
      get() {
        return this.$store.state.selectionGroup.position.z;
      },
      set(value) {
        this.$store.state.selectionGroup.position.z = value;
        this.$store.dispatch("updateLEDConnections", this.$store.state.selectionGroup.children);
      }
    }
  }
};
</script>
