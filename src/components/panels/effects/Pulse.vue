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
        max="1000"
        step="50"
      >
    </div>
  </div>
</template>

<script>
import Default from "./Default.vue";

export default {
  name: "Pulse",
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
      frequency: this.properties["frequency"].value
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
