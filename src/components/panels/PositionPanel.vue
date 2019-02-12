<template>
  <div>
    Position:
    <br>
    <input v-model.number="x" type="number" class="third">
    <input v-model.number="y" type="number" class="third">
    <input v-model.number="z" type="number" class="third">
  </div>
</template>

<script>
export default {
  name: "PositionPanel",
  computed: {
    uuid: function() {
      return this.$store.state.activeObject.uuid;
    },
    type: function() {
      return this.$store.state.activeObject.userData.type;
    },
    x: {
      get() {
        if (this.type == "LED") {
          return this.$store.state.LEDs[this.uuid].position[0];
        } else {
          return this.$store.state.activeObject.position.x;
        }
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          position: [value, this.y, this.z]
        });
      }
    },
    y: {
      get() {
        if (this.type == "LED") {
          return this.$store.state.LEDs[this.uuid].position[1];
        } else {
          return this.$store.state.activeObject.position.y;
        }
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          position: [this.x, value, this.z]
        });
      }
    },
    z: {
      get() {
        if (this.type == "LED") {
          return this.$store.state.LEDs[this.uuid].position[2];
        } else {
          return this.$store.state.activeObject.position.z;
        }
      },
      set(value) {
        this.$store.commit("updateObject", {
          uuid: this.uuid,
          position: [this.x, this.y, value]
        });
      }
    }
  }
};
</script>
