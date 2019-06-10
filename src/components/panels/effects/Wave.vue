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
        min="0.0"
        max="10.0"
        step="0.1"
      >
    </div>
    <div class="form-element">
      <label>Wavelength:</label>
      <input
        type="range"
        v-bind:value="waveLength"
        v-on:input="apply('waveLength', $event.target.value)"
        min="0.0"
        max="1.0"
        step="0.01"
      >
    </div>
    <div class="form-element">
      <label>Length:</label>
      <input
        type="range"
        v-bind:value="length"
        v-on:input="apply('length', $event.target.value)"
        min="0.0"
        max="100.0"
        step="1.0"
      >
    </div>
  </div>
</template>

<script>
import Default from "./Default.vue";

export default {
  name: "Wave",
  mixins: [Default],
  data() {
    return {
      color:
        "#" +
        new THREE.Color(
          this.properties["color"].value.x,
          this.properties["color"].value.y,
          this.properties["color"].value.z
        ).getHexString(),
      frequency: this.properties["frequency"].value,
      waveLength: this.properties["waveLength"].value,
      length: this.properties["length"].value
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
