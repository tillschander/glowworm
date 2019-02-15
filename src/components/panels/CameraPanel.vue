<template>
  <div>
    <button v-on:click="resetCamera">Reset Camera</button>
    <!--<button v-on:click="resetCamera">Center on Object</button>-->
  </div>
</template>

<script>
export default {
  name: "ColorPanel",
  methods: {
    resetCamera: function() {
      this.$store.state.camera.position.set(100, 100, 100);
      this.$store.state.camera.lookAt(0, 200, 0);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
