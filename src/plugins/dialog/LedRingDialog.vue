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
  props: ["$store"],
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
      for (let i = 0; i < this.count; i++) {
        let x = this.radius * Math.cos((2 * i * Math.PI) / this.count);
        let z = this.radius * Math.sin((2 * i * Math.PI) / this.count);

        if (this.$store.state.snapToGrid) {
          x = Math.round(x);
          z = Math.round(z);
        }

        this.$store.commit("addLED", {
          position: [x, 0, z]
        });
      }

      this.$parent.continue();
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