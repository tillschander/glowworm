<template>
  <div>
    Effects:
    <br>====
    <br>
    <select v-model="chosenEffect">
      <option value></option>
      <option value="random">Random</option>
      <option value="wave">Wave</option>
    </select>
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
  name: "EffectsDialog",
  data() {
    return {
      chosenEffect: undefined
    };
  },
  methods: {
    cancel() {
      this.$parent.close();
    },
    add() {
      this.$parent.continue({ effect: this.chosenEffect });
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