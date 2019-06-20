<template>
  <div>
    <div class="form-element">
      <label>Color 1:</label>
      <input
        type="color"
        v-bind:value="color1"
        v-on:input="apply('color1', $event.target.value, hexToThreeColor)"
      >
    </div>
    <div class="form-element">
      <label>Color 2:</label>
      <input
        type="color"
        v-bind:value="color2"
        v-on:input="apply('color2', $event.target.value, hexToThreeColor)"
      >
    </div>
    <div class="form-element">
      <label>Speed:</label>
      <input
        type="range"
        v-bind:value="speed"
        v-on:input="apply('speed', $event.target.value)"
        min="0.0"
        max="10.0"
        step="0.1"
      >
    </div>
  </div>
</template>

<script>
import Default from "./Default.vue";

export default {
  name: "ColorFade",
  mixins: [Default],
  data() {
    return {
      color1:
        "#" +
        new THREE.Color(
          this.properties["color1"].value.x,
          this.properties["color1"].value.y,
          this.properties["color1"].value.z
        ).getHexString(),
      color2:
        "#" +
        new THREE.Color(
          this.properties["color2"].value.x,
          this.properties["color2"].value.y,
          this.properties["color2"].value.z
        ).getHexString(),
      speed: this.properties["speed"].value
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
