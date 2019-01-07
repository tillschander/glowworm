<template>
  <div class="tools-sidebar">
    <button v-on:click="addLed">Add LED</button>
    <button>Connect</button>
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
  position: absolute;
  top: 60px;
  left: 0;
  bottom: 30px;
  width: 50px;
}
</style>
