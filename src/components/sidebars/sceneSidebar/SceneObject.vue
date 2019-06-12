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
      return this.$store.state.elements.activeElements[this.uuid];
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
      let activeUuids = this.$store.getters.activeElementsUuids;

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
          this.$store.commit("clearActiveElements");
        }

        if (this.$store.state.elements.activeElements[this.uuid]) {
          this.$store.commit("removeActiveElement", this.uuid);
        } else {
          this.$store.commit("addActiveElement", this.uuid);
        }
      } else {
        this.$store.commit("clearActiveElements");
        this.$store.commit("addActiveElement", this.uuid);
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
