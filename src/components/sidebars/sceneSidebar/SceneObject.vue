<template>
  <li
    v-bind:class="[{ active: isActive }, 'scene-object ']"
    v-on:click="setActive"
  >{{ getNameFromUuid(this.uuid) }}</li>
</template>

<script>
export default {
  name: "SceneObject",
  props: ["uuid", "type"],
  computed: {
    isActive() {
      return this.$store.state.activeObjects[this.uuid];
    }
  },
  methods: {
    setActive: function() {
      if (this.type !== "LED" && this.type !== "Object") {
        this.$store.commit("clearActiveObjects");
      }

      if (!this.$store.state.shiftPressed) {
        this.$store.commit("clearActiveObjects");
      }

      this.$store.commit("addActiveObject", this.uuid);
    },
    getNameFromUuid: function(uuid) {
      let threeObject = this.$store.state.scene.getObjectByProperty("uuid", uuid);
      return threeObject.name ? threeObject.name : threeObject.userData.type;
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
