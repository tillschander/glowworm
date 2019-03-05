<template>
  <li v-bind:class="[{ active: isActive }, 'scene-object ']" v-on:click="setActive">{{ this.name }}</li>
</template>

<script>
export default {
  name: "SceneObject",
  props: ["uuid", "name"],
  computed: {
    isActive() {
      return this.$store.state.activeObjects[this.uuid];
    }
  },
  methods: {
    setActive: function() {
      if (!this.$store.state.shiftPressed) {
        this.$store.commit("clearActiveObjects");
      }
      this.$store.commit("addActiveObject", this.uuid);
    }
  }
};
</script>

<style scoped lang="scss">
.scene-object {
  cursor: pointer;
  user-select: none;
}
.active {
  color: cyan;
}
</style>
