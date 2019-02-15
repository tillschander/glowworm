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
      this.$store.commit("toggleSnapToGrid");
    },
    toggleShowHelpers() {
      this.$store.commit("toggleShowHelpers");
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
