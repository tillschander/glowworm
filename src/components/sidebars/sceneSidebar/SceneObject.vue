<template>
  <li v-bind:class="[{ active: isActive }, 'scene-object ']" v-on:click="setActive">{{ this.name }}</li>
</template>

<script>
export default {
  name: "SceneObject",
  props: ["uuid", "name"],
  computed: {
    isActive () {
      if (this.$store.state.activeObject) {
        return this.uuid === this.$store.state.activeObject.uuid;
      }
      return false;
    }
  },
  methods: {
    setActive: function() {
      this.$store.commit(
        "setActiveObject",
        this.$store.state.scene.getObjectByProperty("uuid", this.uuid)
      );
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
