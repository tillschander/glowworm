<template>
  <div>
    Ring Options:
    <br>====
    <br>
    <br>LED Count:
    <br>
    <input v-model.number="count" type="number">
    <br>
    <br>Ring Radius:
    <br>
    <input v-model.number="radius" type="number">
    <br>
    <br>
    <div class="buttons">
      <button v-on:click="cancel()">Cancel</button>
      <button v-on:click="add()">Add</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LedRingDialog",
  data() {
    return {
      count: 16,
      radius: 20
    };
  },
  methods: {
    cancel() {
      this.$parent.close();
    },
    add() {
      this.$parent.continue({ count: this.count, radius: this.radius });
    }
  }
};
</script>

<style lang="scss">
.buttons {
  display: flex;
  justify-content: space-between;
}
</style>