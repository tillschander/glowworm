<template>
  <div class="form-element thirds">
    <label>Scale:</label>
    <input v-model.number="x" type="number">
    <input v-model.number="y" type="number">
    <input v-model.number="z" type="number">
  </div>
</template>

<script>
export default {
  name: "ScalePanel",
  computed: {
    activeObject: function() {
      return this.$store.getters.activeObject;
    },
    type: function() {
      return (
        this.activeObject.userData.objectType ||
        this.activeObject.userData.groupType
      );
    },
    x: {
      get() {
        return this.activeObject.scale.x;
      },
      set(value) {
        this.activeObject.scale.x = value;
        this.activeObject.userData.clone.scale.x = value;
        this.$store.state.transformDummy.scale.x = value;

        if (this.activeObject.userData.groupType == "LED") {
          this.activeObject.userData.clone.children.forEach(child => {
            child.scale.setX(1 / this.activeObject.scale.x);
          });
        }

        this.$store.dispatch(
          "updateLEDConnections",
          this.$store.state.selection.selectionGroup
        );
      }
    },
    y: {
      get() {
        return this.activeObject.scale.y;
      },
      set(value) {
        this.activeObject.scale.y = value;
        this.activeObject.userData.clone.scale.y = value;
        this.$store.state.transformDummy.scale.y = value;

        if (this.activeObject.userData.groupType == "LED") {
          this.activeObject.userData.clone.children.forEach(child => {
            child.scale.setY(1 / this.activeObject.scale.y);
          });
        }

        this.$store.dispatch(
          "updateLEDConnections",
          this.$store.state.selection.selectionGroup
        );
      }
    },
    z: {
      get() {
        return this.activeObject.scale.z;
      },
      set(value) {
        this.activeObject.scale.z = value;
        this.activeObject.userData.clone.scale.z = value;
        this.$store.state.transformDummy.scale.z = value;

        if (this.activeObject.userData.groupType == "LED") {
          this.activeObject.userData.clone.children.forEach(child => {
            child.scale.setZ(1 / this.activeObject.scale.z);
          });
        }

        this.$store.dispatch(
          "updateLEDConnections",
          this.$store.state.selection.selectionGroup
        );
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
