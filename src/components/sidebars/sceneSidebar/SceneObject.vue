<template>
  <li>
    <span
      v-bind:class="[{ active: isActive }, 'scene-object ']"
      v-on:click="setActive">{{ name }}</span>
  </li>
</template>

<script>
import SceneObject from "./SceneObject";

export default {
  name: "SceneObject",
  props: ["uuid", "type"],
  computed: {
    isActive() {
      return this.$store.state.activeObjects[this.uuid];
    },
    threeObject() {
      return this.$store.state.scene.getObjectByProperty("uuid", this.uuid);
    },
    name() {
      return this.threeObject.name ? this.threeObject.name : this.threeObject.userData.type;
    }
  },
  methods: {
    setActive: function() {
      if (!this.$store.state.ctrlPressed) {
        this.$store.commit("clearActiveObjects");
      } else if (this.type !== "LED" && this.type !== "Object") {
        // TODO check previous object
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
