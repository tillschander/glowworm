<template>
  <div class="properties-sidebar">Properties:
    <br>====
    <div v-if="this.$store.state.activeObject">
      <div class="position">
        <input v-model.number="x" type="number">
        <input v-model.number="y" type="number">
        <input v-model.number="z" type="number">
      </div>
      <input v-model.number="r" type="range" min="0" max="1" step="0.01">
      <input v-model.number="g" type="range" min="0" max="1" step="0.01">
      <input v-model.number="b" type="range" min="0" max="1" step="0.01">
    </div>
  </div>
</template>

<script>
export default {
  name: "PropertiesSidebar",
  methods: {
    updateLED: function(e) {
      e.target.value;
    }
  },
  computed: {
    uuid: function() {
      return this.$store.state.activeObject.uuid;
    },
    x: {
      get() {
        return this.$store.state.LEDs[this.uuid].position[0];
      },
      set(value) {
        this.$store.commit("updateLED", {
          uuid: this.uuid,
          position: [value, this.y, this.z]
        });
      }
    },
    y: {
      get() {
        return this.$store.state.LEDs[this.uuid].position[1];
      },
      set(value) {
        this.$store.commit("updateLED", {
          uuid: this.uuid,
          position: [this.x, value, this.z]
        });
      }
    },
    z: {
      get() {
        return this.$store.state.LEDs[this.uuid].position[2];
      },
      set(value) {
        this.$store.commit("updateLED", {
          uuid: this.uuid,
          position: [this.x, this.y, value]
        });
      }
    },
    r: {
      get() {
        return this.$store.state.LEDs[this.uuid].color[0];
      },
      set(value) {
        this.$store.commit("updateLED", {
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
        this.$store.commit("updateLED", {
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
        this.$store.commit("updateLED", {
          uuid: this.uuid,
          color: [this.r, this.g, value]
        });
      }
    }
    /*
    activeLED: {
      get() {
        let ao = this.$store.state.activeObject;
        if (ao) {
          let al = this.$store.state.LEDs[ao.uuid];
          return {
            uuid: ao.uuid,
            position: {
              x: al.position[0],
              y: al.position[1],
              z: al.position[2]
            },
            color: { r: al.color[0], g: al.color[1], b: al.color[2] }
          };
          //return Object.assign(this.$store.state.LEDs[this.$store.state.activeObject.uuid], {
          //  uuid: this.$store.state.activeObject.uuid
          //});
        } else {
          return { position: [0, 0, 0], color: [0, 0, 0] };
        }
      },
      set(value) {
        console.log(value);
        //this.$store.commit("updateLED", this.activeLED);
      }
    }
    */
  },
  data: function() {
    return {
      sliderVal: ""
    };
  }
};
</script>

<style scoped lang="scss">
.properties-sidebar {
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: #424242;
  overflow-y: auto;

  input {
    margin-bottom: 20px;
  }

  .position input {
    width: 33.3333%;
  }
}
</style>
