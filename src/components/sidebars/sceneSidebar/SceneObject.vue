<template>
  <li>
    <span v-bind:class="[{ active: isActive }, 'scene-object ']" v-on:click="setActive">{{ name }}</span>
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
      return this.threeObject.name
        ? this.threeObject.name
        : this.threeObject.userData.type;
    }
  },
  methods: {
    setActive: function() {
      let activeUuids = Object.keys(this.$store.state.activeObjects);

      if (this.$store.state.ctrlPressed && activeUuids.length > 0) {
        let multiselectTypes = ["LED", "Object", "Group"];
        let prevObject = this.$store.state.scene.getObjectByProperty(
          "uuid",
          activeUuids[0]
        );

        if (
          multiselectTypes.indexOf(prevObject.userData.type) == -1 ||
          multiselectTypes.indexOf(this.type) == -1
        ) {
          this.$store.commit("clearActiveObjects");
        }

        if (this.$store.state.activeObjects[this.uuid]) {
          this.$store.commit("removeActiveObject", this.uuid);
        } else {
          this.$store.commit("addActiveObject", this.uuid);
        }
      } else {
        this.$store.commit("clearActiveObjects");
        this.$store.commit("addActiveObject", this.uuid);
      }
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
