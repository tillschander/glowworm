<template>
  <div>
    Color:
    <br>
    <input
      type="color"
      v-bind:value="color"
      v-on:input="apply('color', $event.target.value, hexToThreeColor)"
    >
    Opacity:
    <br>
    <input
      type="range"
      v-bind:value="opacity"
      v-on:input="apply('opacity', $event.target.value)"
      min="0"
      max="1"
      step="0.01"
    >
  </div>
</template>

<script>
import { default as Default } from "./Default";
const THREE = require("three");

export default {
  name: "SimpleColor",
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
      opacity: this.properties["opacity"].value
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
