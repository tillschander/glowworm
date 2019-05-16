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
    >Rotate (E)</button>
    <button
      v-on:click="setActiveTool('scale')"
      v-bind:class="{ active: activeTool == 'scale' }"
    >Scale (R)</button>
    <button v-on:click="addLed">Add LED (A)</button>
    <button v-on:click="addLedRing">Add LED-Ring</button>
    <button v-on:click="addLedGrid">Add LED-Grid</button>
    <button v-on:click="addLedLine">Add LED-Line</button>
    <button v-on:click="addBox">Add Box (S)</button>
    <button v-on:click="addPlane">Add Plane</button>
    <button v-on:click="addObject">Add .obj</button>
    <button v-on:click="addAnimation">Add Animation (D)</button>
    <button v-on:click="connect" v-bind:class="{ active: activeTool == 'connect' }">Connect</button>
    <button v-on:click="disconnect" v-bind:class="{ active: activeTool == 'disconnect' }">Disconnect</button>
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
      this.$store.commit("addBox");
    },
    addPlane: function() {
      this.$store.commit("addPlane");
    },
    addLedRing: function() {
      this.$dialog({
        type: "ledRing",
        store: this.$store
      });
    },
    addLedGrid: function() {
      this.$dialog({
        type: "ledGrid",
        store: this.$store
      });
    },
    addLedLine: function() {
      this.$dialog({
        type: "ledLine",
        store: this.$store
      });
    },
    addObject: function() {
      this.$dialog({
        type: "object",
        store: this.$store
      });
    },
    addAnimation: function() {
      this.$store.commit("addAnimation");
    },
    connect: function() {
      this.setActiveTool("connect");
      this.$store.commit("clearActiveObjects");
    },
    disconnect: function() {
      this.setActiveTool("disconnect");
      this.$store.commit("clearActiveObjects");
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
    margin-bottom: 5px;
  }
}
</style>
