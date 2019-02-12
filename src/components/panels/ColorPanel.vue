<template>
  <div>
    Color:
    <br>
    <input v-model.number="r" type="range" min="0" max="1" step="0.01" class="third">
    <input v-model.number="g" type="range" min="0" max="1" step="0.01" class="third">
    <input v-model.number="b" type="range" min="0" max="1" step="0.01" class="third">
  </div>
</template>

<script>
export default {
  name: "ColorPanel",
  computed: {
    uuid: function() {
      return this.$store.state.activeObject.uuid;
    },
    type: function() {
      return this.$store.state.activeObject.userData.type;
    },
    r: {
      get() {
        return this.$store.state.LEDs[this.uuid].color[0];
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          color: [value, this.g, this.b]
        });
      }
    },
    g: {
      get() {
        return this.$store.state.LEDs[this.uuid].color[1];
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          color: [this.r, value, this.b]
        });
      }
    },
    b: {
      get() {
        return this.$store.state.LEDs[this.uuid].color[2];
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          color: [this.r, this.g, value]
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
