<template>
  <div class="tools-sidebar">
    <button
      v-on:click="setActiveTool('select')"
      v-bind:class="{ active: activeTool == 'select' }"
    >Select</button>
    <template v-if="this.mode == 'layout'">
      <button
        v-on:click="setActiveTool('move')"
        v-bind:class="{ active: activeTool == 'move' }"
      >Move</button>
      <button
        v-on:click="setActiveTool('rotate')"
        v-bind:class="{ active: activeTool == 'rotate' }"
      >Rotate</button>
      <button
        v-on:click="setActiveTool('scale')"
        v-bind:class="{ active: activeTool == 'scale' }"
      >Scale</button>
      <button v-on:click="addLed">Add LED</button>
      <button v-on:click="addLedRing">Add LED-Ring</button>
      <button v-on:click="addBox">Add Box</button>
    </template>
  </div>
</template>

<script>
export default {
  name: "ToolsSidebar",
  data() {
    return { showModal: false };
  },
  methods: {
    setActiveTool(tool) {
      this.$store.commit("setActiveTool", tool);
    },
    addLed: function() {
      this.$store.commit("addLED");
    },
    addBox: function() {
      this.$store.commit("addObject");
    },
    addLedRing: function() {
      let self = this;

      this.$myDialog({type: "ledRing", callback: function(options) {
          let count = options.count;
          let radius = options.radius;

          for (let i = 0; i < count; i++) {
            let x = radius * Math.cos((2 * i * Math.PI) / count);
            let z = radius * Math.sin((2 * i * Math.PI) / count);

            if (self.$store.state.snapToGrid) {
              x = Math.round(x);
              z = Math.round(z);
            }

            self.$store.commit("addLED", {
              color: [1, 1, 1],
              position: [x, 0, z]
            });
          }
      }});
    }
  },
  computed: {
    mode: function() {
      return this.$store.state.mode;
    },
    activeTool: function() {
      return this.$store.state.activeTool;
    }
  }
};
</script>

<style scoped lang="scss">
.tools-sidebar {
  display: flex;
  flex-flow: column;

  button {
    padding: 5px;
    margin-bottom: 5px;
    background: #cccccc;
    border: none;
    cursor: pointer;
    border: 2px solid #cccccc;

    &:hover {
      background: #aaaaaa;
    }

    &.active {
      border: 2px solid cyan;
      background: #aaaaaa;
    }
  }
}
</style>
