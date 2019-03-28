<template>
  <div class="viewport-tools">
    <button
      v-on:click="toogleSnapToGrid()"
      v-bind:class="{ active: snapToGrid }"
    >Snap to Grid</button>
    <!--<button
      v-on:click="toggleShowHelpers()"
      v-bind:class="{ active: showHelpers }"
    >Show Helpers</button>-->
  </div>
</template>

<script>
export default {
  name: "ViewportTool",
  methods: {
    toogleSnapToGrid() {
      this.$store.commit("setSnapToGrid", !this.$store.state.snapToGrid);
    },
    toggleShowHelpers() {
      this.$store.commit("setShowHelpers", !this.$store.state.showHelpers);
    }
  },
  computed: {
    snapToGrid: function() {
      return this.$store.state.snapToGrid;
    },
    showHelpers: function() {
      return this.$store.state.showHelpers;
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
