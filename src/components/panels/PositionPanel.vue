<template>
  <div class="form-element thirds">
    <label>Position:</label>
    <input v-model.number="x" type="number">
    <input v-model.number="y" type="number">
    <input v-model.number="z" type="number">
  </div>
</template>

<script>
export default {
  name: "PositionPanel",
  computed: {
    x: {
      get() {
        return this.$store.getters.activeObject.position.x;
      },
      set(value) {
        if (this.$store.state.selection.selectionGroup.length > 1) {
          this.$store.state.selection.selectionGroup.forEach(child => {
            let offset = this.$store.state.transformDummy.position.x - value;
            child.position.x -= offset;
            child.userData.clone.position.x -= offset;
          });
          this.$store.state.transformDummy.position.x = value;
        } else {
          this.$store.getters.activeObject.position.x = value;
          this.$store.getters.activeObject.userData.clone.position.x = value;
          this.$store.state.transformDummy.position.x = value;
        }
        this.$store.dispatch("updateLEDConnections", this.$store.state.selection.selectionGroup);
      }
    },
    y: {
      get() {
        return this.$store.getters.activeObject.position.y;
      },
      set(value) {
        if (this.$store.state.selection.selectionGroup.length > 1) {
          this.$store.state.selection.selectionGroup.forEach(child => {
            let offset = this.$store.state.transformDummy.position.y - value;
            child.position.y -= offset;
            child.userData.clone.position.y -= offset;
          });
          this.$store.state.transformDummy.position.y = value;
        } else {
          this.$store.getters.activeObject.position.y = value;
          this.$store.getters.activeObject.userData.clone.position.y = value;
          this.$store.state.transformDummy.position.y = value;
        }
        this.$store.dispatch("updateLEDConnections", this.$store.state.selection.selectionGroup);
      }
    },
    z: {
      get() {
        return this.$store.getters.activeObject.position.z;
      },
      set(value) {
        if (this.$store.state.selection.selectionGroup.length > 1) {
          this.$store.state.selection.selectionGroup.forEach(child => {
            let offset = this.$store.state.transformDummy.position.z - value;
            child.position.z -= offset;
            child.userData.clone.position.z -= offset;
          });
          this.$store.state.transformDummy.position.z = value;
        } else {
          this.$store.getters.activeObject.position.z = value;
          this.$store.getters.activeObject.userData.clone.position.z = value;
          this.$store.state.transformDummy.position.z = value;
        }
        this.$store.dispatch("updateLEDConnections", this.$store.state.selection.selectionGroup);
      }
    }
  }
};
</script>
