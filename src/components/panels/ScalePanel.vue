<template>
  <div>
    Scale:
    <br>
    <input v-model.number="x" type="number" class="third">
    <input v-model.number="y" type="number" class="third">
    <input v-model.number="z" type="number" class="third">
  </div>
</template>

<script>
export default {
  name: "ScalePanel",
  computed: {
    uuid: function() {
      return this.$store.state.activeObject.uuid;
    },
    type: function() {
      return this.$store.state.activeObject.userData.type;
    },
    x: {
      get() {
        return this.$store.state.activeObject.scale.x;
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          scale: [value, this.y, this.z]
        });
      }
    },
    y: {
      get() {
        return this.$store.state.activeObject.scale.y;
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          scale: [this.x, value, this.z]
        });
      }
    },
    z: {
      get() {
        return this.$store.state.activeObject.scale.z;
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          scale: [this.x, this.y, value]
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
