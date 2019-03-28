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
      this.$store.state.orbit.reset();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
