<template>
  <div class="tools-sidebar">
    <button v-on:click="addLed">Add LED</button>
  </div>
</template>

<script>
export default {
  name: 'ToolsSidebar',
  methods: {
    addLed: function() {
      this.$store.commit('addLED');
    }
  }
}
</script>

<style scoped lang="scss">
.tools-sidebar {
  background: #424242;
}
</style>
