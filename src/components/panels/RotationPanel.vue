<template>
  <div>
    Rotation:
    <br>
    <input v-model.number="x" type="number" class="third">
    <input v-model.number="y" type="number" class="third">
    <input v-model.number="z" type="number" class="third">
  </div>
</template>

<script>
export default {
  name: "RotationPanel",
  computed: {
    uuid: function() {
      return Object.keys(this.$store.state.activeObjects)[0];
    },
    object: function() {
      return this.$store.state.scene.getObjectByProperty("uuid", this.uuid);
    },
    type: function() {
      return this.object.userData.type;
    },
    x: {
      get() {
        return this.object.rotation.x;
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          rotation: [value, this.y, this.z]
        });
      }
    },
    y: {
      get() {
        return this.object.rotation.y;
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          rotation: [this.x, value, this.z]
        });
      }
    },
    z: {
      get() {
        return this.object.rotation.z;
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          rotation: [this.x, this.y, value]
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
