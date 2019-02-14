<template>
  <div>Effects:
    <br>
    <div class="effect">
      Random:
      <br>
      <label>
        Intensity:
        <input type="range" min="0" max="1" step="0.01">
      </label>
      <label>
        Frequency:
        <input type="range" min="0" max="1" step="0.01">
      </label>
      <label>
        Shape:
        <select>
          <option value="random">Square</option>
        </select>
      </label>
    </div>
    <button v-on:click="addEffect">Add Effect</button>
  </div>
</template>

<script>
export default {
  name: "EffectsPanel",
  methods: {
    addEffect: function() {
      let self = this;

      this.$dialog({type: "effects", callback: function(options) {
        console.log(options);
      }});
    }
  }
};
</script>

<style scoped lang="scss">
button {
  width: 100%;
}
</style>
