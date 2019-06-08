<template>
  <div class="form-element thirds">
    <label>Rotation:</label>
    <input v-model.number="x" type="number">
    <input v-model.number="y" type="number">
    <input v-model.number="z" type="number">
  </div>
</template>

<script>
export default {
  name: "RotationPanel",
  computed: {
    x: {
      get() {
        return THREE.Math.radToDeg(this.$store.getters.activeObject.rotation.x);
      },
      set(value) {
        if (this.$store.state.selection.selectionGroup.length > 1) {
          this.$store.state.selection.selectionGroup.forEach(child => {
            let offset = this.$store.state.transformDummy.rotation.x - THREE.Math.degToRad(value);
            child.rotation.x -= offset;
            child.userData.clone.rotation.x -= offset;
          });
          this.$store.state.transformDummy.rotation.x = THREE.Math.degToRad(value);
        } else {
          this.$store.getters.activeObject.rotation.x = THREE.Math.degToRad(value);
          this.$store.getters.activeObject.userData.clone.rotation.x = THREE.Math.degToRad(value);
          this.$store.state.transformDummy.rotation.x = THREE.Math.degToRad(value);
        }
        this.$store.dispatch("updateLEDConnections", this.$store.state.selection.selectionGroup);
      }
    },
    y: {
      get() {
        return THREE.Math.radToDeg(this.$store.getters.activeObject.rotation.y);
      },
      set(value) {
        if (this.$store.state.selection.selectionGroup.length > 1) {
          this.$store.state.selection.selectionGroup.forEach(child => {
            let offset = this.$store.state.transformDummy.rotation.y - THREE.Math.degToRad(value);
            child.rotation.y -= offset;
            child.userData.clone.rotation.y -= offset;
          });
          this.$store.state.transformDummy.rotation.y = THREE.Math.degToRad(value);
        } else {
          this.$store.getters.activeObject.rotation.y = THREE.Math.degToRad(value);
          this.$store.getters.activeObject.userData.clone.rotation.y = THREE.Math.degToRad(value);
          this.$store.state.transformDummy.rotation.y = THREE.Math.degToRad(value);
        }
        this.$store.dispatch("updateLEDConnections", this.$store.state.selection.selectionGroup);
      }
    },
    z: {
      get() {
        return THREE.Math.radToDeg(this.$store.getters.activeObject.rotation.z);
      },
      set(value) {
        if (this.$store.state.selection.selectionGroup.length > 1) {
          this.$store.state.selection.selectionGroup.forEach(child => {
            let offset = this.$store.state.transformDummy.rotation.z - THREE.Math.degToRad(value);
            child.rotation.z -= offset;
            child.userData.clone.rotation.z -= offset;
          });
          this.$store.state.transformDummy.rotation.z = THREE.Math.degToRad(value);
        } else {
          this.$store.getters.activeObject.rotation.z = THREE.Math.degToRad(value);
          this.$store.getters.activeObject.userData.clone.rotation.z = THREE.Math.degToRad(value);
          this.$store.state.transformDummy.rotation.z = THREE.Math.degToRad(value);
        }
        this.$store.dispatch("updateLEDConnections", this.$store.state.selection.selectionGroup);
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
