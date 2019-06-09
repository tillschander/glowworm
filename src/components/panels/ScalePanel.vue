<template>
  <div class="form-element thirds">
    <label>Scale:</label>
    <input v-model.number="x" type="number">
    <input v-model.number="y" type="number">
    <input v-if="type != 'Plane'" v-model.number="z" type="number">
  </div>
</template>

<script>
export default {
  name: "ScalePanel",
  computed: {
    type: function() {
      return this.$store.getters.activeObject.userData.objectType || this.$store.getters.activeObject.userData.groupType;
    },
    x: {
      get() {
        return this.$store.getters.activeObject.scale.x;
      },
      set(value) {
        if (this.$store.state.selection.selectionGroup.length > 1) {
          this.$store.state.selection.selectionGroup.forEach(child => {
            let offset = this.$store.state.transformDummy.scale.x - value;

            if (child.userData.type !== 'LED') {
              child.scale.x -= offset;
              child.userData.clone.scale.x -= offset;
            }
          });
          this.$store.state.transformDummy.scale.x = value;
        } else {
          this.$store.getters.activeObject.scale.x = value;
          this.$store.getters.activeObject.userData.clone.scale.x = value;
          this.$store.state.transformDummy.scale.x = value;
        }
        this.$store.dispatch("updateLEDConnections", this.$store.state.selection.selectionGroup);
      }
    },
    y: {
      get() {
        return this.$store.getters.activeObject.scale.y;
      },
      set(value) {
        if (this.$store.state.selection.selectionGroup.length > 1) {
          this.$store.state.selection.selectionGroup.forEach(child => {
            let offset = this.$store.state.transformDummy.scale.y - value;

            if (child.userData.type !== 'LED') {
              child.scale.y -= offset;
              child.userData.clone.scale.y -= offset;
            }
          });
          this.$store.state.transformDummy.scale.y = value;
        } else {
          this.$store.getters.activeObject.scale.y = value;
          this.$store.getters.activeObject.userData.clone.scale.y = value;
          this.$store.state.transformDummy.scale.y = value;
        }
        this.$store.dispatch("updateLEDConnections", this.$store.state.selection.selectionGroup);
      }
    },
    z: {
      get() {
        return this.$store.getters.activeObject.scale.z;
      },
      set(value) {
        if (this.$store.state.selection.selectionGroup.length > 1) {
          this.$store.state.selection.selectionGroup.forEach(child => {
            let offset = this.$store.state.transformDummy.scale.z - value;

            if (child.userData.type !== 'LED') {
              child.scale.z -= offset;
              child.userData.clone.scale.z -= offset;
            }
          });
          this.$store.state.transformDummy.scale.z = value;
        } else {
          this.$store.getters.activeObject.scale.z = value;
          this.$store.getters.activeObject.userData.clone.scale.z = value;
          this.$store.state.transformDummy.scale.z = value;
        }
        this.$store.dispatch("updateLEDConnections", this.$store.state.selection.selectionGroup);
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
