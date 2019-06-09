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
      this.$store.state.orbitControl.reset();
    }
  }
};
</script>

<style scoped lang="scss">
button {
  width: 100%;
}
</style>
