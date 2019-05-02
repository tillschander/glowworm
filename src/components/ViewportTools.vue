<template>
  <div class="viewport-tools">
    <button
      v-on:click="toogleSnapToGrid()"
      v-bind:class="{ active: snapToGrid }"
    >Snap to Grid</button>
    <button
      v-on:click="toggleShowConnections()"
      v-bind:class="{ active: showConnections }"
    >Show Connections</button>
  </div>
</template>

<script>
export default {
  name: "ViewportTool",
  methods: {
    toogleSnapToGrid() {
      this.$store.commit("setSnapToGrid", !this.$store.state.snapToGrid);
    },
    toggleShowConnections() {
      this.$store.commit("setShowConnections", !this.$store.state.showConnections);
    }
  },
  computed: {
    snapToGrid: function() {
      return this.$store.state.snapToGrid;
    },
    showConnections: function() {
      return this.$store.state.showConnections;
    }
  }
};
</script>

<style scoped lang="scss">
.viewport-tools {
  display: flex;
  flex-flow: row;
}

button {
  margin-left: 5px;
}
</style>
