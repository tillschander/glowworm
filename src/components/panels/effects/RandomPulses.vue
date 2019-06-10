<template>
  <div>
    <div class="form-element">
      <label>Color:</label>
      <input
        type="color"
        v-bind:value="color"
        v-on:input="apply('color', $event.target.value, hexToThreeColor)"
      >
    </div>
    <div class="form-element">
      <label>Frequency:</label>
      <input
        type="range"
        v-bind:value="frequency"
        v-on:input="apply('frequency', $event.target.value)"
        min="0"
        max="3"
        step="0.01"
      >
    </div>
    <div class="form-element">
      <label>Amount:</label>
      <input
        type="range"
        v-bind:value="amount"
        v-on:input="apply('amount', $event.target.value)"
        min="0"
        max="1"
        step="0.01"
      >
    </div>
  </div>
</template>

<script>
import Default from "./Default.vue";

export default {
  name: "RandomPulses",
  mixins: [Default],
  data() {
    return {
      frequency: this.properties["frequency"].value,
      amount: this.properties["amount"].value,
      color:
        "#" +
        new THREE.Color(
          this.properties["color"].value.x,
          this.properties["color"].value.y,
          this.properties["color"].value.z
        ).getHexString()
    };
  },
  methods: {
    hexToThreeColor: function(color) {
      let threeColor = new THREE.Color(color);
      return new THREE.Vector3(threeColor.r, threeColor.g, threeColor.b);
    }
  }
};
</script>
