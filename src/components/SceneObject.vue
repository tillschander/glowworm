<template>
  <div v-bind:class="[{ active: isActive }, 'scene-object ']" v-on:click="setActive">{{ uuid }}</div>
</template>

<script>
export default {
  name: "SceneObject",
  props: ["uuid"],
  computed: {
    isActive: function() {
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
  padding: 3px;
  cursor: pointer;
  border: 2px solid transparent;
  user-select: none;
}
.active {
  border: 2px solid cyan;
}
</style>
