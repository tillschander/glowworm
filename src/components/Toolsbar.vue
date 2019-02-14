<template>
  <div class="tools-sidebar">
    <button
      v-on:click="setActiveTool('select')"
      v-bind:class="{ active: activeTool == 'select' }"
    >Select (Q)</button>
    <button
      v-on:click="setActiveTool('move')"
      v-bind:class="{ active: activeTool == 'move' }"
    >Move (W)</button>
    <button
      v-on:click="setActiveTool('rotate')"
      v-bind:class="{ active: activeTool == 'rotate' }"
    >Rotate (R)</button>
    <button
      v-on:click="setActiveTool('scale')"
      v-bind:class="{ active: activeTool == 'scale' }"
    >Scale (S)</button>
    <button v-on:click="addLed">Add LED (A)</button>
    <button v-on:click="addLedRing">Add LED-Ring</button>
    <button v-on:click="addBox">Add Box (S)</button>
    <button v-on:click="addAnimation">Add Animation (D)</button>
  </div>
</template>

<script>
export default {
  name: "Toolsbar",
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

      this.$dialog({type: "ledRing", callback: function(options) {
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
    },
    addAnimation: function() {
      this.$store.commit("addAnimation");
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
