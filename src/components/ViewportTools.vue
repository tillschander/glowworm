<template>
  <div class="viewport-tools">
    <button
      v-on:click="toggleShowConnections()"
      v-bind:class="{ active: showConnections }"
      title="Show Connections"
    >
      <div v-html="iconUtil.load('show_connections')"></div>
    </button>
    <button
      v-on:click="toogleSnapToGrid()"
      v-bind:class="{ active: snapToGrid }"
      title="Snap to Grid"
    >
      <div v-html="iconUtil.load('snap_to_grid')"></div>
    </button>
  </div>
</template>

<script>
import iconUtil from "../utils/icon.js";

export default {
  name: "ViewportTool",
  data() {
    return {
      iconUtil: iconUtil
    };
  },
  methods: {
    toogleSnapToGrid() {
      this.$store.commit("setSnapToGrid", !this.snapToGrid);
    },
    toggleShowConnections() {
      this.$store.commit("setShowConnections", !this.showConnections);
    }
  },
  computed: {
    snapToGrid: function() {
      return this.$store.state.snapToGrid;
    },
    showConnections: function() {
      return this.$store.state.connections.showConnections;
    }
  }
};
</script>

<style scoped lang="scss">
.viewport-tools {
  display: flex;
  flex-flow: row;
  margin: 10px 10px 0 0;
}

button {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  margin-left: 1px;
  background: #424242;
  color: #ffffff;

  &:hover,
  &:focus,
  &.active {
    background: #424242;
    border: 0;
    outline: 0;
  }

  &:focus {
    color: #ffffff;
  }

  &:hover {
    color: #00ffff;
  }

  &.active {
    color: #00ffff;
  }
}
</style>
